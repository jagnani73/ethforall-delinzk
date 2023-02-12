import type { CustomFieldTypes } from "./shared.types";

export interface OrganizationOnboardingPageProps {
  linkQR: Object;
}

export interface OrganizationOnboardingProps {
  linkQR: Object;
}

export interface OrganizationSigninPageProps {
  qr: string;
  sessionId: string;
}

export interface OrganizationSigninProps {
  qr: string;
}

export interface ClaimSchema {
  name: string;
  description: string;
  fields: CustomFieldTypes[];
}
