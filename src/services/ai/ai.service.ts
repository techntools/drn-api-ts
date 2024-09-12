import { Request, Response } from "express";
import { PostImageTextRequest } from "./ai.service.model";
import vision from "./vision/vision";

/**
 * handle post /ai/image request to send response of vision data
 *
 * @param {Request} req express request
 * @param {Response} res express response
 * @returns {Promise<void>} void promise
 */
export const postImageText = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body as PostImageTextRequest;
  const visionResponse = await vision.getImageText(body.data.image);
  if ("errors" in visionResponse) {
    res.status(500).send({ errors: [] });
    return;
  }
  res.send({ data: visionResponse.data });
};
