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
  res.status(501).send();
};
