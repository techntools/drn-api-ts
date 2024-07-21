import { Request, Response } from "express";
import db from "../../db/db";

export const getCourses = async (req: Request, res: Response) => {
  // TODO: implement const query = req.query;
  const dbResponse = await db.getCourses();
  if ("errors" in dbResponse) {
    console.error(dbResponse, "errors in dbResponse (postInventory)");
    res.status(500).send(dbResponse);
    return;
  }
  res.send(dbResponse);
};
