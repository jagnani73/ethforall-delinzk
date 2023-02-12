import type { CustomFieldTypes } from "./shared.types";

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

export interface ClaimSchema {
  name: string;
  description: string;
  fields: CustomFieldTypes[];
}
