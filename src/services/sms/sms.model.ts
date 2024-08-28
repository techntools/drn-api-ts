export const PHONE_OPT_IN_TYPE = "phoneOptIn";

export const OPT_IN_KEYWORDS: string[] = [
  "start",
  "disc",
  "claim",
  "unstop",
] as const;
export const OPT_OUT_KEYWORDS: string[] = ["cancel", "stop"] as const;

export type GetPhoneOptInsQuery = {
  phone?: string[];
  smsConsent?: (0 | 1)[];
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
    : `We do not have any discs in the system with your phone number, however, at any time you can visit https://bit.ly/3MjWTRh to search the inventory for your lost plastic. Additionally, if any show up in the network, we will let you know.`;
