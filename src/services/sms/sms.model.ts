export const PHONE_OPT_IN_TYPE = "phoneOptIn";

export const OPT_IN_KEYWORDS: string[] = ["start", "disc", "claim"] as const;
export const OPT_OUT_KEYWORDS: string[] = ["cancel", "stop"] as const;

export type GetPhoneOptInsQuery = {
  phone?: string[];
};

export type PutPhoneOptInBody = {
  data: {
    id: string;
    type: string;
    attributes: {
      smsConsent: 1 | 0;
    };
  };
};

export const formatClaimInventoryMessage = (unclaimedInventoryLength: number) =>
  unclaimedInventoryLength > 0
    ? `You have ${unclaimedInventoryLength} ${
        unclaimedInventoryLength > 1 ? "discs" : "disc"
      } waiting to be claimed. Claim here: https://bit.ly/3MjWTRh`
    : `You have 0 discs waiting to be claimed. Visit us: https://bit.ly/3MjWTRh`;
