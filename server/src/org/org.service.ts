import { auth, protocol, loaders, resolver } from "@iden3/js-iden3-auth";
import { v4 } from "uuid";
import { join, parse } from "path";
import axios from "axios";

import TunnelService from "../services/tunnel.service";
import CacheService from "../services/cache.service";
import SocketService from "../services/socket.service";
import SupabaseService from "../services/supabase.service";
import EmailService from "../services/email.service";
import { getAdminAuthToken } from "../admin/admin.service";
import TokenService from "../services/token.service";

export type Attributes = Array<{
  attributeKey: string;
  attributeValue: number;
}>;

export const generateAuthQr = async (sessionId: string) => {
  const hostUrl = (await TunnelService.getTunnel())?.url;
  const cache = await CacheService.getCache();
  const request = auth.createAuthorizationRequestWithMessage(
    "Sign in as a verified organization into deLinZK.",
    "I hereby verify that I am an verified organization of deLinZK.",
    process.env.POLYGONID_ISSUERDID!,
    `${hostUrl}/api/v1/org/sign-in-callback?sessionId=${sessionId}`
  );
  const requestId = v4();
  request.id = requestId;
  request.thid = requestId;
  console.log("Request ID set as:", requestId);
  const proofRequest: protocol.ZKPRequest = {
    id: 1,
    circuit_id: "credentialAtomicQuerySig",
    rules: {
      query: {
        allowedIssuers: [process.env.POLYGONID_ISSUERDID!],
        schema: {
          type: "deLinZK Verified Organization",
          url: "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/fea6164e-c164-4ce1-b204-4e841698ac33.json-ld",
        },
        req: {
          verified: {
            $eq: 1,
          },
        },
      },
    },
  };
  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];
  await cache?.set(
    `delinzk:auth-request:${sessionId}`,
    JSON.stringify(request),
    {
      EX: 1800,
    }
  );
  console.log("Request cached for session", sessionId, ":");
  console.dir(request, { depth: null });
  return request;
};

export const authVerify = async (
  sessionId: string,
  jwz: string,
  persist: boolean = true
) => {
  const cache = await CacheService.getCache();
  const socket = SocketService.getSocket();
  const verificationKeyLoader = new loaders.FSKeyLoader(
    join(__dirname, "..", "..", "keys")
  );
  const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");
  const ethStateResolver = new resolver.EthStateResolver(
    `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_APIKEY}`,
    "0x46Fd04eEa588a3EA7e9F055dd691C688c4148ab3"
  );
  const verifier = new auth.Verifier(
    verificationKeyLoader,
    sLoader,
    ethStateResolver
  );
  try {
    const authRequest = (await cache?.get(
      `delinzk:auth-request:${sessionId}`
    )) as string;
    const authResponse = await verifier.fullVerify(
      jwz,
      JSON.parse(authRequest)
    );
    if (persist) {
      await cache?.set(`delinzk:auth-session:${sessionId}`, authResponse.from, {
        EX: 86400,
      });
      const token = await TokenService.createJWE(
        await TokenService.createJWS(
          { sessionId: sessionId, did: authResponse.from },
          "24h"
        )
      );
      console.log("JWE generated:", token);
      socket.to(sessionId).emit("auth", token);
    } else {
      socket.to(sessionId).emit("auth", authResponse.from);
    }
    await cache?.DEL(`delinzk:auth-request:${sessionId}`);
    return authResponse;
  } catch (err) {
    console.error("Error verifying request!");
    console.error(err);
  }
};

export const storeOrganizerData = async (
  email: string,
  name: string,
  industry: string,
  tagline: string,
  size: number
): Promise<number> => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("orgs")
    .insert({
      email: email,
      name: name,
      tagline: tagline,
      industry: industry,
      size: size,
      license: "",
      did: "",
    })
    .select();
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  return data[0].id;
};

export const storeAndUpdateLicense = async (
  orgId: number,
  license: Express.Multer.File
) => {
  const fileName = license.originalname.split(".");
  const extension = fileName[fileName.length - 1];
  const db = await SupabaseService.getSupabase();
  const { data: data1, error: error1 } = await db!.storage
    .from("org-documents")
    .upload(`${orgId}.${extension}`, license.buffer, {
      contentType: license.mimetype,
    });
  if (error1) {
    const err = {
      errorCode: 500,
      name: "Storage Error",
      message: "Supabase storage called failed",
      storageError: error1,
    };
    throw err;
  }
  const { data: data2, error: error2 } = await db!.storage
    .from("org-documents")
    .createSignedUrl(data1.path, 60 * 60 * 24 * 365, {
      download: true,
    });
  if (error2) {
    const err = {
      errorCode: 500,
      name: "Storage Error",
      message: "Supabase storage called failed",
      storageError: error2,
    };
    throw err;
  }
  const { data, error: error3 } = await db!
    .from("orgs")
    .update({ license: data2?.signedUrl })
    .eq("id", orgId);
  if (error3) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error3,
    };
    throw err;
  }
};

export const checkIfVerificationPendingExists = async (org_id: number) => {
  const cache = await CacheService.getCache();
  const requestExists = await cache!.get(
    `delinzk:verification-pending:${org_id}`
  );

  return requestExists ? true : false;
};

const storeVerificationStateKeys = async (
  requestId: string,
  org_id: number
) => {
  const cache = await CacheService.getCache();
  await cache?.set(`delinzk:request-id:${requestId}`, org_id, {
    EX: 604800,
  });
  await cache?.set(`delinzk:verification-pending:${org_id}`, requestId, {
    EX: 604800,
  });
};

export const storeVerificationState = async (org_id: number) => {
  const isVerificationPending = await checkIfVerificationPendingExists(org_id);
  if (isVerificationPending) {
    return null;
  } else {
    const requestId = v4();
    await storeVerificationStateKeys(requestId, org_id);
    return requestId;
  }
};

export const sendEmailToOrganization = async (
  requestId: string,
  org_id: number
) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!.from("orgs").select().eq("id", org_id);

  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }

  const rawEmail = await EmailService.generateEmail(
    "org-approval",
    data[0].email,
    "Congratulations 🥳! You have been approved on deLinZK",
    {
      url: `${process.env.SUBDOMAIN_FE}/organization/onboarding?reqId=${requestId}`,
    },
    []
  );

  await EmailService.sendEmail(data[0].email, rawEmail);
};
export const generateBasicAuthQr = async (reqId: string) => {
  const hostUrl = (await TunnelService.getTunnel())?.url;
  const cache = await CacheService.getCache();
  const request = auth.createAuthorizationRequestWithMessage(
    "Verify your Polygon ID wallet.",
    "I hereby verify that I possess a valid DID.",
    process.env.POLYGONID_ISSUERDID!,
    `${hostUrl}/api/v1/org/sign-up-complete-callback?sessionId=${reqId}`
  );
  const requestId = v4();
  request.id = requestId;
  request.thid = requestId;
  console.log("Basic Auth Request ID set as:", requestId);
  await cache?.set(`delinzk:auth-request:${reqId}`, JSON.stringify(request), {
    EX: 1800,
  });
  console.log("Request cached for basic auth session", reqId, ":");
  console.dir(request, { depth: null });
  return request;
};

export const checkIfRequestIdExists = async (reqId: string) => {
  const cache = await CacheService.getCache();
  const requestExists = await cache!.get(`delinzk:request-id:${reqId}`);
  return requestExists ? true : false;
};

export const storeOrgDid = async (orgDid: string, sessionId: string) => {
  const cache = await CacheService.getCache();
  const db = await SupabaseService.getSupabase();
  const orgId = +((await cache?.get(`delinzk:request-id:${sessionId}`)) ?? "0");
  const { data, error } = await db!
    .from("orgs")
    .update({ did: orgDid })
    .eq("id", orgId);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  return orgId;
};

export const clearSignupCache = async (orgId: number, sessionId: string) => {
  const cache = await CacheService.getCache();
  await cache?.DEL(`delinzk:auth-request:${sessionId}`);
  await cache?.DEL(`delinzk:request-id:${sessionId}`);
  await cache?.DEL(`delinzk:verification-pending:${orgId}`);
};

export const generateClaimOffer = async (
  schemaId: string,
  attributes: Attributes
) => {
  const authToken = await getAdminAuthToken();
  const { data } = await axios.post(
    `https://api-staging.polygonid.com/v1/issuers/${process.env.POLYGONID_ISSUERID}/schemas/${schemaId}/offers`,
    {
      attributes: attributes,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return data.id;
};

export const generateClaimAuth = async (
  claimOfferId: string
): Promise<{
  qrCode: Record<string, any>;
  claimOfferSessionId: string;
}> => {
  console.log("Claim offer ID:", claimOfferId);
  const { data } = await axios.post(
    `https://api-staging.polygonid.com/v1/offers-qrcode/${claimOfferId}`
  );
  const qrCode = data.qrcode;
  const claimOfferSessionId = data.sessionID;
  console.log("Claim offer auth generated:");
  console.dir(qrCode, { depth: null });
  return {
    qrCode: qrCode,
    claimOfferSessionId: claimOfferSessionId,
  };
};

export const generateOrgClaim = async (sessionId: string) => {
  const claimParams: Attributes = [
    {
      attributeKey: "verified",
      attributeValue: 1,
    },
  ];
  const claimOfferId = await generateClaimOffer(
    process.env.POLYGONID_CLAIMSCHEMAID_VERIFIED_ORG!,
    claimParams
  );
  const { qrCode: claimQr, claimOfferSessionId } = await generateClaimAuth(
    claimOfferId
  );
  const socket = await SocketService.getSocket();
  socket.to(sessionId).emit("org-auth", JSON.stringify(claimQr));
  Promise.all([checkClaimStatus(claimOfferId, claimOfferSessionId)]).then(
    (qrCodeData) => {
      socket.to(sessionId).emit("org-claim", JSON.stringify(qrCodeData[0]));
    }
  );
};

export const checkClaimStatus = async (offerId: string, sessionId: string) => {
  while (true) {
    try {
      const { data } = await axios.get(
        `https://api-staging.polygonid.com/v1/offers-qrcode/${offerId}?sessionID=${sessionId}`
      );
      if (data.status === "done") {
        console.log(
          "Claim offer ID",
          offerId,
          "session ID",
          sessionId,
          "QR generated:"
        );
        console.dir(data.qrcode, { depth: null });
        return data.qrcode;
      }
      await new Promise((resolve, reject) =>
        setTimeout(() => resolve(0), 1000)
      );
    } catch (err) {
      break;
    }
  }
};

export const storeClaimOffer = async (claimOfferId: string) => {
  const reqId = v4();
  const cache = await CacheService.getCache();
  await cache?.set(`delinzk:claim-pending:${reqId}`, claimOfferId, {
    EX: 604800,
  });
  return reqId;
};

export const sendClaimOfferEmail = async (email: string, reqId: string) => {
  const rawEmail = await EmailService.generateEmail(
    "org-claim-offer",
    email,
    "Hello there, hustler 🧑‍💻! You have received a new Proof-of-Employment on deLinZK",
    {
      url: `${process.env.SUBDOMAIN_FE}/employee/claim?reqId=${reqId}`,
    },
    []
  );

  await EmailService.sendEmail(email, rawEmail);
};

export const sendOrganizationSignupCompleteEmail = async (orgId: number) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("orgs")
    .select("email")
    .eq("id", orgId);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  const email = data[0]?.email;
  const rawEmail = await EmailService.generateEmail(
    "org-signup",
    email,
    "Hello Organization Admin 👷! We've received your request for signing up on deLinZK",
    {},
    []
  );
  await EmailService?.sendEmail(email, rawEmail);
};

export const getOrgsData = async (projection: string[], id?: number) => {
  let parsedProjection = "";
  if (projection?.length > 0) {
    parsedProjection = projection.reduce(
      (prev, current) => prev + "," + current
    );
  } else {
    parsedProjection = "*";
  }
  const db = await SupabaseService.getSupabase();
  let query = db!.from("orgs").select(parsedProjection);
  if (id) {
    query = query.eq("id", id);
  }
  const { data, error } = await query;
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  return data;
};

export const addJob = async (
  orgId: number,
  name: string,
  description: string
) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("jobs")
    .insert({
      org_id: orgId,
      name: name,
      description: description,
    })
    .select("id");
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  return data[0].id;
};

export const getOrgJobs = async (orgId: number) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!.from("jobs").select().eq("org_id", orgId);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  return data;
};

export const checkJobOwnership = async (orgId: number, jobId: number) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("jobs")
    .select()
    .eq("id", jobId)
    .eq("org_id", orgId);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  if (data[0]) return true;
  else return false;
};

export const getOrgJobApplications = async (jobId: number) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("job-applications")
    .select(
      `
  *,
  user:users(name,username,poes)
  `
    )
    .eq("id", jobId);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  return data;
};
