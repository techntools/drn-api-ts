import { Request, Response } from "express";
import { DISCS_TYPE, GetDiscsQuery } from "./discs.service.model";
import db from "../../db/db";

export const getDiscs = async (req: Request, res: Response) => {
  const query = req.query as GetDiscsQuery;
  const dbResponse = await db.getDiscs(
    query.name,
    query.brandId,
    query.brandName
  );
  if ("errors" in dbResponse) {
    console.error(dbResponse, "errors in dbResponse (getBrands)");
    res.status(500).send(dbResponse);
    return;
  }

  res.send({
    data: (
      dbResponse.data as {
        MoldID: number;
        MoldName: string;
        BrandID: number;
        BrandName: string;
      }[]
    ).map((e) => ({
      type: DISCS_TYPE,
      id: e.MoldID,
      attributes: {
        MoldName: e.MoldName,
        BrandID: e.BrandID,
        BrandName: e.BrandName,
      },
    })),
  });
};
