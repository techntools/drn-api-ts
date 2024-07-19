export type GetInventoryQuery = {
  course: string[];
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
