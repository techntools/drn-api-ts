import { ImageAnnotatorClient } from "@google-cloud/vision";
import credentials from "./credentials.json";
import { TResponse } from "../../../app.model";
import { ImageDetectionData, TextData } from "./vision.model";
import colorName from "color-namer";

const imgAnnotator = new ImageAnnotatorClient({ credentials });

const getImageText = async (
  img: string
): Promise<TResponse<ImageDetectionData>> => {
  try {
    const req = {
      image: {
        content: Buffer.from(img, "base64"),
      },
      features: [
        {
          type: "IMAGE_PROPERTIES",
        },
        {
          type: "DOCUMENT_TEXT_DETECTION",
        },
      ],
    };
    const imgData = await imgAnnotator.annotateImage(req);
    console.log(JSON.stringify(imgData));
    const text = imgData[0].fullTextAnnotation.pages[0].blocks.reduce(
      (prev, data) => {
        data.paragraphs.reduce((w, e) => {
          const wordSet = e.words.map((b) => {
            return {
              confidence: b.confidence,
              word: b.symbols
                .map((x) => {
                  return x.text;
                })
                .join(""),
            };
          });
          prev.words.push(...wordSet);
          return w;
        }, []);
        return prev;
      },
      {
        confidence: imgData[0].fullTextAnnotation.pages[0].confidence,
        words: [],
      } as TextData
    );

    const colors =
      imgData[0].imagePropertiesAnnotation?.dominantColors.colors.map(
        (color) => {
          return {
            ...color,
            name: colorName(
              `rgb(${color.color.red},${color.color.green},${color.color.blue})`
            ).ntc[0].name,
          };
        }
      );
    return { data: { text, colors } };
  } catch (e) {
    console.error(e, "vision text error (getImageText)");
    return { errors: [] };
  }
};

export default {
  getImageText,
};
