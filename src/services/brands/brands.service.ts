import { Request, Response } from "express";
import db from "../../db/db";
import { BRAND_TYPE, GetBrandsQuery } from "./brand.service.model";

/**
 * handle get /brands to retrieve and respond with a list of brands
 *
 * @param {Request} req express request
 * @param {Response} res express response
 * @returns {Promise<void>} void promise
 */
export const getBrands = async (req: Request, res: Response): Promise<void> => {
  const query = req.query as GetBrandsQuery;
  const dbResponse = await db.getBrands(query.name);
  if ("errors" in dbResponse) {
    console.error(dbResponse, "errors in dbResponse (getBrands)");
    res.status(500).send(dbResponse);
    return;
  }

  res.send({
    data: (dbResponse.data as { BrandID: number; BrandName: string }[]).map(
      (e) => ({
        type: BRAND_TYPE,
        id: e.BrandID,
        attributes: { BrandName: e.BrandName },
      })
    ),
  });
};
