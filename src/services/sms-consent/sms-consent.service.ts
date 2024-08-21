import { Request, Response } from "express";
import twilio, { twiml } from "twilio";
import db, { putPhoneOptIn } from "../../db/db";
import {
  GetPhoneOptInsQuery,
  OPT_IN_KEYWORDS,
  OPT_OUT_KEYWORDS,
  PHONE_OPT_IN_TYPE,
} from "./sms-consent.model";
import { TWILIO_AUTH_TOKEN, TWILIO_SID, TWILIO_SEND_FROM } from "../../env";

export const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

export const handleTwilioOptIn = async (
  request: Request,
  response: Response
) => {
  try {
    const phoneNumber = request.body.From;
    const message = request.body.Body;
    const messageSender = request.body.From;
    let responseMessage: string | null =
      "Thanks for the message -Disc Rescue Network";
    if (message && typeof message === "string") {
      console.log(`/twilio/opt-in ${messageSender}: "${message}"`);
      const testMessage = message.trim().toLowerCase();
      if (OPT_IN_KEYWORDS.includes(testMessage)) {
        console.log("opt in");
        const dbResponse = await putPhoneOptIn({ id: phoneNumber, optIn: 1 });
        if ("errors" in dbResponse) {
          response.status(500).send();
          return;
        }
        responseMessage =
          "Thanks for the message (opt in) -Disc Rescue Network";
      } else if (OPT_OUT_KEYWORDS.includes(testMessage)) {
        console.log("opt out");
        const dbResponse = await putPhoneOptIn({ id: phoneNumber, optIn: 0 });
        if ("errors" in dbResponse) {
          response.status(500).send();
          return;
        }
        responseMessage =
          "Thanks for the message (opt out) -Disc Rescue Network";
      }
    } else {
      console.error(
        `post at /twilio/opt-in does not have message data ${JSON.stringify(
          request.body
        )}`
      );
    }

    if (responseMessage === null) {
      response.status(500).send();
      return;
    }
    const twilioResponse = new twiml.MessagingResponse();
    twilioResponse.message(responseMessage);
    response.type("text/xml").status(200).send(twilioResponse.toString());
  } catch (e) {
    console.error("error on twilio opt in ", e);
    response.status(500).send();
  }
};

export const getPhoneOptIns = async (request: Request, response: Response) => {
  const query = request.query as GetPhoneOptInsQuery;
  const dbResponse = await db.getPhoneOptIns(query.phone);
  if ("errors" in dbResponse) {
    console.error(dbResponse, "errors in dbResponse (getInventory)");
    response.status(500).send(dbResponse);
    return;
  }
  const { data } = dbResponse;
  if (!Array.isArray(data)) {
    response.status(500).send();
    return;
  }
  response.status(200).send({
    data: data.map((e) => ({
      type: PHONE_OPT_IN_TYPE,
      id: e.id,
      attributes: { smsConsent: e.sms_consent },
    })),
  });
};
