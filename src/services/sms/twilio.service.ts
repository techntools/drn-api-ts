import twilio from "twilio";
import { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_SEND_FROM } from "../../env";
import vCards from "vcards-js";

const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export const sendSms = async (
  toPhoneNumber: string,
  messageBody: string
): Promise<void | { errors: object[] }> => {
  try {
    const messageInstance = await twilioClient.messages.create({
      body: messageBody,
      from: TWILIO_SEND_FROM,
      to: toPhoneNumber,
    });
    console.log("messageInstance", messageInstance);
  } catch (e) {
    console.error(e, "twilio sendsms err");
    return { errors: [] };
  }
};

export const sendVCard = async (
  toPhoneNumber: string,
  messageBody: string
): Promise<void | { errors: object[] }> => {
  try {
    const messageInstance = await twilioClient.messages.create({
      body: messageBody,
      from: TWILIO_SEND_FROM,
      to: toPhoneNumber,
      mediaUrl: [
        "https://drn-api-v2.discrescuenetwork.com/phone-opt-ins/twilio/vcf",
      ],
    });
    console.log("messageInstance", messageInstance);
  } catch (e) {
    console.error(e, "twilio sendsms err");
    return { errors: [] };
  }
};
