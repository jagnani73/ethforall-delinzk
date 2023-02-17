import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import axios from "axios";

import SupabaseService from "../services/supabase.service";
import CacheService from "../services/cache.service";

export const storeAdminCredentials = async (
  email: string,
  password: string
) => {
  const db = await SupabaseService.getSupabase();
  const hashedPassword = await bcrypt.hash(password, 12);
  const { data, error } = await db!.from("admins").insert({
    email: email,
    password: hashedPassword,
  });
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

export const verifyAdminCredentials = async (
  email: string,
  password: string
) => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!.from("admins").select().eq("email", email);
  if (error) {
    const err = {
      errorCode: 500,
      name: "Database Error",
      message: "Supabase database called failed",
      databaseError: error,
    };
    throw err;
  }
  if (data[0]?.email) {
    const isVerified = await bcrypt.compare(password, data[0]?.password);
    if (!isVerified) {
      const err = {
        errorCode: 400,
        name: "Bad Request",
        message: "The credentials are incorrect.",
      };
      throw err;
    }
  } else {
    const err = {
      errorCode: 400,
      name: "Bad Request",
      message: "The credentials are incorrect.",
    };
    throw err;
  }
};

export const createJWToken = async (email: string) => {
  const token = sign(
    {
      email: email,
      admin: true,
    },
    process.env.ADMIN_JWT_SECRET_KEY!,
    {
      issuer: "deLinZK",
      expiresIn: "24h",
    }
  );
  return token;
};
export const fetchOrganizations = async () => {
  const db = await SupabaseService.getSupabase();
  const { data, error } = await db!.from("orgs").select().eq("did", "");

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

export const getAdminAuthToken = async (): Promise<string> => {
  const cache = await CacheService.getCache();
  const authToken = await cache?.get("delinzk:admin:auth-token");
  if (authToken) {
    return authToken;
  } else {
    const { data } = await axios.post(
      "https://api-staging.polygonid.com/v1/orgs/sign-in",
      {
        email: process.env.POLYGONID_ADMIN_EMAIL!,
        password: process.env.POLYGONID_ADMIN_PASSWORD!,
      }
    );
    await cache?.set("delinzk:admin:auth-token", data.token, {
      EX: 86400,
    });
    return data.token;
  }
};
