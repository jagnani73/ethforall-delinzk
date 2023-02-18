import CacheService from "../services/cache.service";
import SocketService from "../services/socket.service";
import { checkClaimStatus } from "../org/org.service";
import { v4 } from "uuid";
import TunnelService from "../services/tunnel.service";
import { auth, protocol } from "@iden3/js-iden3-auth";
import SupabaseService from "../services/supabase.service";
import EmailService from "../services/email.service";

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
): Promise<{ available: boolean; claimOfferId?: string }> => {
  const cache = await CacheService.getCache();
  const claimOfferId = await cache?.get(`delinzk:claim-pending:${reqId}`);
  if (claimOfferId) {
    return {
      available: true,
      claimOfferId: claimOfferId,
    };
  } else {
    return {
      available: false,
    };
  }
};

export const listenForClaimAuthComplete = async (
  reqId: string,
  claimOfferId: string,
  claimOfferSessionId: string
) => {
  const socket = await SocketService.getSocket();
  const cache = await CacheService.getCache();
  Promise.all([checkClaimStatus(claimOfferId, claimOfferSessionId)]).then(
    async (qrCodeData) => {
      socket.to(reqId).emit("user-claim", JSON.stringify(qrCodeData[0]));
      await cache?.DEL(`delinzk:claim-pending:${reqId}`);
    }
  );
};

export const generateAuthQr = async (
  sessionId: string,
  action: "sign-up" | "sign-in"
) => {
  const hostUrl = (await TunnelService.getTunnel())?.url;
  const cache = await CacheService.getCache();
  const request = auth.createAuthorizationRequestWithMessage(
    "Verify your Polygon ID wallet.",
    "I hereby verify that I possess a valid DID.",
    process.env.POLYGONID_ISSUERDID!,
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

  return data[0];
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
  return data[0];
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
    JSON.stringify(cacheObject)
  );
  return cacheObject;
};

export const storeProofOfEmployment = async (sessionId: string) => {
  const db = await SupabaseService.getSupabase();
  const cache = await CacheService.getCache();
  const socket = await SocketService.getSocket();
  const proofOfEmployment = (await cache?.getDel(
    `delinzk:pending-add-poe:${sessionId}`
  )) as unknown as proofOfEmploymentCache;
  const { data: data1, error: error1 } = await db!
    .from("users")
    .select("poes")
    .eq("id", proofOfEmployment.id);
  if (error1) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error1,
    };
    throw err;
  }
  const existingPoes = JSON.parse(data1[0].poes) as Array<
    proofOfEmploymentCache["proof"]
  >;
  const { error: error2 } = await db!
    .from("users")
    .update({
      poes: [...existingPoes, JSON.stringify(proofOfEmployment.proof)],
    })
    .eq("id", proofOfEmployment.id);
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
  const request = auth.createAuthorizationRequestWithMessage(
    "Verify your Proof-of-Employment issued via deLinZK.",
    "I hereby verify that I have a Proof-of-Employment issued by a deLinZK verified organization.",
    process.env.POLYGONID_ISSUERDID!,
    `${hostUrl}/api/v1/user/add-poe-callback?sessionId=${sessionId}`
  );
  const requestId = v4();
  request.id = requestId;
  request.thid = requestId;
  console.log("Request ID set as:", requestId);

  //! ERROR: Need to resolve multiple queries in Iden3 circuits
  const proofRequest: protocol.ZKPRequest = {
    id: 1,
    circuit_id: "credentialAtomicQueryMTP",
    rules: {
      query: [
        {
          allowedIssuers: [process.env.POLYGONID_ISSUERDID!],
          schema: {
            type: "deLinZK Proof-of-Employment",
            url: "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/347bf7b1-a278-49eb-9e08-40b32fbe73b6.json-ld",
          },
          req: {
            "deLinZK Organization ID": {
              $eq: orgId,
            },
          },
        },
        {
          allowedIssuers: [process.env.POLYGONID_ISSUERDID!],
          schema: {
            type: "deLinZK Proof-of-Employment",
            url: "https://s3.eu-west-1.amazonaws.com/polygonid-schemas/347bf7b1-a278-49eb-9e08-40b32fbe73b6.json-ld",
          },
          req: {
            Tenure: {
              $eq: tenure,
            },
          },
        },
      ],
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
