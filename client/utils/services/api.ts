import type { AxiosInstance } from "axios";
import axios from "axios";

import type { AdminOrg } from "../types/admin.types";
import type { EmployeeProofOrg, EmployeeType } from "../types/employee.types";

const apiInstance: AxiosInstance = axios.create({
  baseURL: `https://${process.env.NEXT_PUBLIC_API_HOSTNAME!}/api/v1`,
  headers: {
    "Bypass-Tunnel-Reminder": 1,
  },
});

export const AdminLogin = async (input: {
  admin_email: string;
  admin_password: string;
}): Promise<string> => {
  const { data } = await apiInstance.post("/admin/log-in", input);

  return data.token as string;
};

export const AdminOrgs = async (token: string): Promise<AdminOrg[]> => {
  const { data } = await apiInstance.get("/admin/orgs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.organizations as AdminOrg[];
};

export const OrgApprove = async (
  id: string,
  token: string
): Promise<string> => {
  const { data } = await apiInstance.post(
    "/org/approve",
    { org_id: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data as string;
};

export const OrgSignup = async (data: FormData): Promise<void> => {
  await apiInstance.post("/org/sign-up", data);

  return;
};

export const OrgSignupComplete = async (reqId: string): Promise<string> => {
  const { data } = await apiInstance.get("/org/sign-up-complete", {
    params: { reqId },
  });

  return JSON.stringify(data);
};

export const OrgSignin = async (): Promise<{
  qr: string;
  sessionId: string;
}> => {
  const { data, headers } = await apiInstance.get("/org/sign-in");

  return {
    qr: data,
    sessionId: headers["x-delinzk-session-id"] ?? null,
  };
};

export const OrgCreateClaim = async (
  token: string,
  employee_tenure: number,
  employee_email: string
): Promise<void> => {
  await apiInstance.post(
    "/org/create-poe",
    {
      employee_tenure,
      employee_email,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return;
};

export const EmpSignupQR = async (): Promise<{
  qr: string;
  sessionId: string;
}> => {
  const { data, headers } = await apiInstance.get("/user/sign-up");

  return {
    qr: data,
    sessionId: headers["x-delinzk-session-id"] ?? null,
  };
};

export const EmpSignupForm = async (data: FormData): Promise<void> => {
  await apiInstance.post("/user/sign-up-complete", data);

  return;
};

export const EmpSignin = async (): Promise<{
  qr: string;
  sessionId: string;
}> => {
  const { data, headers } = await apiInstance.get("/user/sign-in");

  return {
    qr: data,
    sessionId: headers["x-delinzk-session-id"] ?? null,
  };
};

export const EmpCheck = async (token: string): Promise<void> => {
  await apiInstance.get("/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return;
};

export const EmpClaim = async (reqId: string): Promise<string> => {
  const { data } = await apiInstance.get("/user/claim-poe", {
    params: { reqId },
  });

  return JSON.stringify(data);
};

export const EmpProfile = async (token: string): Promise<EmployeeType> => {
  const { data } = await apiInstance.get("/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.profile;
};

export const EmpProfileUpdate = async (
  token: string,
  data: Record<string, string>
): Promise<void> => {
  await apiInstance.post("/user/profile/update", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return;
};

export const PublicProfile = async (
  username: string
): Promise<EmployeeType> => {
  const { data } = await apiInstance.get(`/user/profile/${username}`);

  return data.profile;
};

export const EmpProof = async (
  token: string,
  tenure: number,
  orgId: string
): Promise<{
  qr: string;
  sessionId: string;
}> => {
  const { data, headers } = await apiInstance.post(
    "/user/add-poe",
    {
      tenure,
      orgId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    qr: data,
    sessionId: headers["x-delinzk-session-id"] ?? null,
  };
};

export const EmpProofOrgs = async (): Promise<EmployeeProofOrg[]> => {
  const { data } = await apiInstance.get("/org/data", {
    params: {
      project: ["name", "id"].join(","),
    },
  });

  return data.data;
};

export const OrgCreateJob = async (
  token: string,
  data: {
    name: string;
    description: string;
  }
): Promise<void> => {
  await apiInstance.post("/org/create-job", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return;
};
