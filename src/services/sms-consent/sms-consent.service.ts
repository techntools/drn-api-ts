import { Request, Response } from "express";

export const handleTwilioOptIn = (request: Request, response: Response) => {
  console.log("twilio opt in request", request.body);
  response.status(200).send();
};
