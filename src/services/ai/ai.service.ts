import { Request, Response } from "express";
import { PostImageTextRequest } from "./ai.service.model";
import vision from "./vision/vision";

export const postImageText = async (req: Request, res: Response) => {
  const body = req.body as PostImageTextRequest;
  const visionResponse = await vision.getImageText(body.data.image);
  if ("errors" in visionResponse) {
    res.status(500).send({ errors: [] });
    return;
  }
  res.send({ data: visionResponse.data });
};
