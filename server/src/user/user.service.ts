import CacheService from "../services/cache.service";
import SocketService from "../services/socket.service";
import { checkClaimStatus } from "../org/org.service";
import { v4 } from "uuid";
import TunnelService from "../services/tunnel.service";
import { auth } from "@iden3/js-iden3-auth";
import SupabaseService from "../services/supabase.service";

export interface UserData {
  about: string;
  email: string;
  name: string;
  username: string;
  industry: string;
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

export const generateAuthQr = async (sessionId: string) => {
  const hostUrl = (await TunnelService.getTunnel())?.url;
  const cache = await CacheService.getCache();
  const request = auth.createAuthorizationRequestWithMessage(
    "Verify your Polygon ID wallet.",
    "I hereby verify that I possess a valid DID.",
    process.env.ISSUERID!,
    `${hostUrl}/api/v1/user/sign-up-callback?sessionId=${sessionId}`
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
      photo: ""
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

export const storeUserDetails = async (did: string, userData: UserData) => {
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
