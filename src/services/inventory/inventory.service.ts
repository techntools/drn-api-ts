import { Request, Response } from "express";
import { isInventoryQuery } from "./inventory.service.model";
import db from "../../db/db";

export const getInventory = async (req: Request, res: Response) => {
  const { query } = req;

  if (!isInventoryQuery(query)) {
    res.status(400).send("unexpected query params");
    return;
  }

  const inventoryData = await db.getInventory(query.course);

  res.send(inventoryData);
};
