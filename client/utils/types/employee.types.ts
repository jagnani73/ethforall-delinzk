export interface EmployeeClaimPageProps {
  linkQR: string;
}

export interface EmployeeClaimProps {
  linkQR: string;
}

export interface EmployeeSignupPageProps {
  qr: string;
  sessionId: string;
}

export interface EmployeeSignupProps {
  qr: string;
  sessionId: string;
}

export interface EmployeeSigninPageProps {
  qr: string;
  sessionId: string;
}

export interface EmployeeSigninProps {
  qr: string;
  sessionId: string;
}

export type EmployeeType = {
  name: string;
  username: string;
  industry: string;
  about: string;
  email: string;
  photo: string;
};

export interface EmployeeProfileProps {
  employee: EmployeeType;
}

export interface EmployeeProofOrg {
  id: number;
  name: string;
  photo: string;
}

export interface EmployeeProofPageProps {
  organizations: EmployeeProofOrg[];
}

export interface EmployeeProofProps {
  organizations: EmployeeProofOrg[];
}
