import { Request, Response } from "express";
import {
  GetInventoryQuery,
  PostInventoryBody,
} from "./inventory.service.model";
import db from "../../db/db";

export const getInventory = async (req: Request, res: Response) => {
  const query = req.query as GetInventoryQuery;
  const inventoryData = await db.getInventory(query.course);
  res.send(inventoryData);
};

export const postInventory = async (req: Request, res: Response) => {
  const body = req.body as PostInventoryBody;
  const dbResponse = await db.postInventory(body.data.attributes);
  if ("errors" in dbResponse) {
    res.status(500).send(dbResponse);
    return;
  }
  if (!("insertId" in dbResponse.data)) {
    console.error(dbResponse, "db error no insertId in dbResponse");
  }
  res.send(
    "insertId" in dbResponse.data
      ? { data: { id: dbResponse.data.insertId, ...body.data } }
      : body
  );
};

export const patchInventory = async (req: Request, res: Response) => {};
