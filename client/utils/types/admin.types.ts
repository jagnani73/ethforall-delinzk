export interface AdminOrg {
  id: string;
  did: string;
  name: string;
  industry: string;
  size: number;
  tagline: string;
  license: string;
  email: string;
}

export interface OrgDetailsProps {
  icon: React.ReactNode;
  heading: React.ReactNode;
  content: React.ReactNode;
}
