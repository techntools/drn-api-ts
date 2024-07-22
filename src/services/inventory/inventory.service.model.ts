export const INVENTORY_TYPE = "inventory";

export type GetInventoryQuery = {
  course?: string[];
  brand?: string[];
};

// TODO: validate
export type PostInventoryBody = {
  data: {
    type: "inventory";
    attributes: {
      course: string;
      name: string;
      disc: string;
      phoneNumber: string;
      bin: string;
      comments: string;
      dateFound: string;
      color: string;
      brand: string;
    };
  };
};

export type PatchInventoryBody = {
  data: {
    type: string;
    attributes: {
      course?: string;
      name?: string;
      disc?: string;
      phoneNumber?: string;
      bin?: string;
      comments?: string;
      dateFound?: string;
      color?: string;
      brand?: string;
    };
  };
};
