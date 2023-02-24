import CacheService from "../services/cache.service";
import SocketService from "../services/socket.service";
import { v4 } from "uuid";
import TunnelService from "../services/tunnel.service";
import { auth, protocol } from "@iden3/js-iden3-auth";
import SupabaseService from "../services/supabase.service";
import EmailService from "../services/email.service";
import KeyServices from "../services/key.service";
import PolygonIDService from "../services/polygonid.service";

export interface UpdateUserData {
  about: string;
  name: string;
  industry: string;
}

export interface proofOfEmploymentCache {
  id: number;
  proof: {
    orgName: string;
    tenure: number;
  };
}

export interface UserData extends UpdateUserData {
  email: string;
  username: string;
  photo: string;
}

export const checkIfClaimOfferExists = async (
  reqId: string
): Promise<{ available: boolean; claimPoeHash?: string }> => {
  const cache = await CacheService.getCache();
  const claimPoeHash = await cache?.get(`delinzk:claim-pending:${reqId}`);
  if (claimPoeHash) {
    return {
      available: true,
      claimPoeHash: claimPoeHash,
    };
  } else {
    return {
      available: false,
    };
  }
};

export const generateAuthQr = async (
  sessionId: string,
  action: "sign-up" | "sign-in"
) => {
  const hostUrl = (await TunnelService.getTunnel())?.url;
  const cache = await CacheService.getCache();
  const issuerDid = await PolygonIDService.getIssuerDID();
  const request = auth.createAuthorizationRequestWithMessage(
    "Verify your Polygon ID wallet.",
    "I hereby verify that I possess a valid DID.",
    issuerDid,
    `${hostUrl}/api/v1/user/${action}-callback?sessionId=${sessionId}`
  );
  const requestId = v4();
  request.id = requestId;
  request.thid = requestId;
  console.log("Basic Auth Request ID set as:", requestId);
  await cache?.set(
    `delinzk:auth-request:${sessionId}`,
    JSON.stringify(request),
    {
      EX: 1800,
    }
  );
  console.log("Request cached for basic auth session", sessionId, ":");
  console.dir(request, { depth: null });
  return request;
};

export const createEmptyUser = async (did: string) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("users")
    .insert({
      did: did,
      name: "",
      username: "",
      industry: "",
      about: "",
      email: "",
      photo: "",
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

export const storeUserPhoto = async (photo: Express.Multer.File) => {
  const fileName = photo.originalname.split(".");
  const extension = fileName[fileName.length - 1];
  const db = await SupabaseService.getSupabase();
  const { data: data1, error: error1 } = await db!.storage
    .from("user-documents")
    .upload(`${v4()}.${extension}`, photo.buffer, {
      contentType: photo.mimetype,
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
  const { data: data2 } = await db!.storage
    .from("user-documents")
    .getPublicUrl(data1.path);
  return data2.publicUrl;
};

export const updateUserDetails = async (
  did: string,
  userData: UserData | UpdateUserData
) => {
  const db = await SupabaseService.getSupabase();
  const { error } = await db!.from("users").update(userData).eq("did", did);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
};

export const fetchUserPublicDetails = async (username: string) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("users")
    .select()
    .eq("username", username);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  const parsedData = data[0];
  parsedData.poes = parsedData.poes.map((poe: string) => JSON.parse(poe));
  return parsedData;
};

export const fetchUserPrivateDetails = async (did: string) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!.from("users").select().eq("did", did);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  const parsedData = data[0];
  parsedData.poes = parsedData.poes.map((poe: string) => JSON.parse(poe));
  return parsedData;
};

export const sendUserSignupCompleteEmail = async (email: string) => {
  const rawEmail = await EmailService.generateEmail(
    "user-signup",
    email,
    "Hello there, hustler 🧑‍💻! Welcome to deLinZK ❤️",
    {},
    []
  );
  await EmailService?.sendEmail(email, rawEmail);
};

export const cachePendingProofOfEmployment = async (
  userId: number,
  orgId: number,
  tenure: number,
  sessionId: string
): Promise<proofOfEmploymentCache> => {
  const db = await SupabaseService.getSupabase();
  const cache = await CacheService.getCache();
  const { data, error } = await db!.from("orgs").select("name").eq("id", orgId);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  const cacheObject = {
    id: userId,
    proof: {
      orgName: data[0].name,
      tenure: tenure,
    },
  };
  await cache?.set(
    `delinzk:pending-add-poe:${sessionId}`,
    JSON.stringify(cacheObject),
    {
      EX: 1800,
    }
  );
  return cacheObject;
};

export const storeProofOfEmployment = async (sessionId: string) => {
  const db = await SupabaseService.getSupabase();
  const cache = await CacheService.getCache();
  const socket = await SocketService.getSocket();
  const proofOfEmployment = JSON.parse(
    (await cache?.get(`delinzk:pending-add-poe:${sessionId}`)) ?? ""
  ) as proofOfEmploymentCache;
  console.log("PoE Cache fetched for session ID", sessionId, ":");
  console.dir(proofOfEmployment, { depth: null });
  const { data: data1, error: error1 } = await db!
    .from("users")
    .select("poes")
    .eq("id", +proofOfEmployment.id);
  if (error1) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error1,
    };
    throw err;
  }
  const existingPoes = data1[0].poes as Array<proofOfEmploymentCache["proof"]>;
  const { error: error2 } = await db!
    .from("users")
    .update({
      poes: [...existingPoes, JSON.stringify(proofOfEmployment.proof)],
    })
    .eq("id", +proofOfEmployment.id);
  if (error2) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error2,
    };
    throw err;
  }
  socket
    .to(sessionId)
    .emit("proof-generated", JSON.stringify(proofOfEmployment.proof));
  await cache?.DEL(`delinzk:pending-add-poe:${sessionId}`);
  console.log(
    "PoEs updated for userId",
    proofOfEmployment.id,
    "for session ID",
    sessionId,
    ":"
  );
  console.dir([...existingPoes, proofOfEmployment.proof], { depth: null });
};

export const generateProofQr = async (
  sessionId: string,
  userId: number,
  orgId: number,
  tenure: number
) => {
  const hostUrl = (await TunnelService.getTunnel())?.url;
  const cache = await CacheService.getCache();
  const issuerDid = await PolygonIDService.getIssuerDID();
  const request = auth.createAuthorizationRequestWithMessage(
    "Verify your Proof-of-Employment issued via deLinZK.",
    "I hereby verify that I have a Proof-of-Employment issued by a deLinZK verified organization.",
    issuerDid,
    `${hostUrl}/api/v1/user/add-poe-callback?sessionId=${sessionId}`
  );
  const requestId = v4();
  request.id = requestId;
  request.thid = requestId;
  console.log("Request ID set as:", requestId);

  const poeHash = KeyServices.createPoeHashKey(tenure, orgId);

  const proofRequest: protocol.ZKPRequest = {
    id: 1,
    circuitId: "credentialAtomicQuerySigV2",
    query: {
      allowedIssuers: [issuerDid],
      type: "deLinZKProofOfEmployment",
      context:
        "https://gist.githubusercontent.com/gitaalekhyapaul/d13f9429ba2dabbb3764f3ff2656d29c/raw/delinzk-proof-of-employment.json-ld",
      credentialSubject: {
        poeHash: {
          $eq: poeHash,
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
  Promise.all([cachePendingProofOfEmployment(userId, orgId, tenure, sessionId)])
    .then((res) => {
      console.log(
        "Pending Proof-of-Employment cached for session",
        sessionId,
        ":"
      );
      console.dir(res[0], { depth: null });
    })
    .catch((err) => console.error(err));
  return request;
};

export const userApplyJob = async (userId: number, jobId: number) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("job-applications")
    .insert({
      job_id: jobId,
      user_id: userId,
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
  Promise.all([
    (async () => {
      const db = await SupabaseService.getSupabase();
      const { data: data1, error: error1 } = await db!
        .from("users")
        .select("email")
        .eq("id", userId);
      if (error1) {
        const err = {
          errorCode: 500,
          name: "Database Error",
          message: "Supabase database called failed",
          databaseError: error1,
        };
        throw err;
      }
      const { data: data2, error: error2 } = await db!
        .from("jobs")
        .select(
          `
        name,
        org:orgs(name)
        `
        )
        .eq("id", jobId);
      if (error2) {
        const err = {
          errorCode: 500,
          name: "Database Error",
          message: "Supabase database called failed",
          databaseError: error2,
        };
        throw err;
      }
      const rawEmail = await EmailService.generateEmail(
        "job-application-success",
        data1[0].email,
        "Hello there, hustler 🧑‍💻! You've successfully applied for a job 🔥",
        {
          jobName: data2[0].name,
          orgName: (data2[0].org as { name: any }).name,
        },
        []
      );
      await EmailService.sendEmail(data1[0].email, rawEmail);
    })(),
  ]).catch((e) => console.error(e));
  return data[0].id;
};

export const userGetApplications = async (userId: number) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!
    .from("job-applications")
    .select(
      `
    id,
    job:jobs(name, org:orgs(name))
    `
    )
    .eq("user_id", userId);
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

export const getAllJobsByUser = async (applicationIds: string[]) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!.from("jobs").select(`
  *,
  org:orgs(id,name)
  `);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  const parsedData = data.filter((job) => {
    if (applicationIds.includes(job.id)) return false;
    else return true;
  });
  return parsedData;
};

export const generateClaimAuth = async (reqId: string) => {
  const hostUrl = (await TunnelService.getTunnel())?.url;
  const cache = await CacheService.getCache();
  const issuerDid = await PolygonIDService.getIssuerDID();
  const request = auth.createAuthorizationRequestWithMessage(
    "Verify your Polygon ID wallet.",
    "I hereby verify that I possess a valid DID.",
    issuerDid,
    `${hostUrl}/api/v1/user/claim-poe-callback?sessionId=${reqId}`
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

export const createUserPoeClaim = async (
  sessionId: string,
  userDid: string
) => {
  const cache = await CacheService.getCache();
  const poeHash = +(
    (await cache?.get(`delinzk:claim-pending:${sessionId}`)) ?? "0"
  );
  await cache?.DEL(`delinzk:claim-pending:${sessionId}`);
  const qrData = await PolygonIDService.createVerifiedPoeClaim(
    userDid,
    poeHash
  );
  return qrData;
};
