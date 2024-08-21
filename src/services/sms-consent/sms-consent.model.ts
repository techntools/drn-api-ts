export const PHONE_OPT_IN_TYPE = "phoneOptIn";

export const OPT_IN_KEYWORDS: string[] = ["start", "disc", "claim"] as const;
export const OPT_OUT_KEYWORDS: string[] = ["cancel", "stop"] as const;

export type GetPhoneOptInsQuery = {
  phone?: string[];
};
