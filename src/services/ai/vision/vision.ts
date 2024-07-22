import { ImageAnnotatorClient } from "@google-cloud/vision";
import credentials from "./credentials.json";
import { mockBase64 } from "./mock";
import { TResponse } from "../../../app.model";

const imgAnnotator = new ImageAnnotatorClient({ credentials });

const getImageText = async (img: string): Promise<TResponse<string>> => {
  try {
    const req = {
      image: {
        content: Buffer.from(mockBase64, "base64"),
      },
    };
    const imgData = await imgAnnotator.textDetection(req);
    return { data: imgData[0].fullTextAnnotation.text };
  } catch (e) {
    console.error(e, "vision text error (getImageText)");
    return { errors: [] };
  }
};

export default {
  getImageText,
};
