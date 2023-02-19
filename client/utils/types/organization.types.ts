export interface OrganizationOnboardingPageProps {
  linkQR: string;
}

export interface OrganizationOnboardingProps {
  linkQR: string;
}

export interface OrganizationSigninPageProps {
  qr: string;
  sessionId: string;
}

export interface OrganizationSigninProps {
  qr: string;
  sessionId: string;
}

export interface OrganizationJobApplicantProps {
  id: number;
  user_id: number;
  job_id: number;
  user: {
    name: string;
    username: string;
    poes: string[];
  };
}

export interface OrganizationJobApplicantsProps {
  applicants: OrganizationJobApplicantProps[];
}
