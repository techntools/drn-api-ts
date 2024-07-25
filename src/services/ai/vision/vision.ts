import vision, { ImageAnnotatorClient } from "@google-cloud/vision";
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
      features: [
        // TODO: decide to set maxResults for each feat, default is 10
        {
          type: "IMAGE_PROPERTIES",
        },
        {
          type: "TEXT_DETECTION",
        },
      ],
    };
    const imgData = await imgAnnotator.annotateImage(req);
    console.log(imgData[0].imagePropertiesAnnotation.dominantColors.colors);
    console.log(imgData[0].textAnnotations);
    return { data: imgData as any };
  } catch (e) {
    console.error(e, "vision text error (getImageText)");
    return { errors: [] };
  }
};

export default {
  getImageText,
};
