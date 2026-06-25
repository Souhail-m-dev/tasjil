export type TenantTheme = {
  emerald: string;
  emeraldDeep: string;
  gold: string;
  goldSoft: string;
  paper: string;
  paperCream: string;
  paperDeep: string;
  lineSoft: string;
  inkFade: string;
};

export type TenantConfig = {
  slug: string;
  hosts: string[];
  brand: {
    name: string;
    shortName: string;
    logoSrc: string;
  };
  prof: {
    name: string;
    role: string;
    credentials: string[];
    bioParas: string[];
    telegram: string | null;
    youtube: string | null;
    tazkiyaUrl: string | null;
  };
  terminology: {
    /** singular unit of study, e.g. "séminaire" | "niveau" */
    unit: string;
    /** overarching cycle, e.g. "session" | "année" */
    cycle: string;
  };
  mail: {
    /** signature line at the bottom of transactional emails */
    signature: string;
    paypalEmail: string | null;
    revolutHandle: string | null;
    whatsapp: string | null;
  };
  schedule: string;
  theme: TenantTheme;
  features: {
    bundle: boolean;
    zoom: boolean;
    presentiel: boolean;
    certificate: boolean;
    /** collect a payment method during registration */
    payment: boolean;
    /** collect extended profile (birth date, phone, address, availability, prior group) */
    extendedProfile: boolean;
  };
  metadata: {
    title: string;
    description: string;
  };
};
