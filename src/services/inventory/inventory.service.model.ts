export const INVENTORY_TYPE = "inventory";

export type GetInventoryQuery = {
  course?: string[];
  name?: string[];
  disc?: string[];
  phoneNumber?: string[];
  bin?: string[];
  dateFound?: string[];
  dateTexted?: string[];
  dateClaimed?: string[];
  status?: string[];
  comments?: string[];
  color?: string[];
  claimBy?: string[];
  brand?: string[];
  dateSold?: string[];
  reminderTextSent?: (0 | 1)[];
  topImage?: string[];
  bottomImage?: string[];
  deleted?: (0 | 1)[];
  id?: number[];
  dateOfReminderText?: string[];
};

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
      orgCode: string;
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
      reminderTextSent?: 0 | 1;
      deleted?: 0 | 1;
    };
  };
};
