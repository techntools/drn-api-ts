import { Request, Response } from 'express'
import twilio, { twiml } from "twilio";

import smsService from './service'
import lib from './lib'

import { sendSms, sendVCard } from "../sms/twilio.service";
import {
  OPT_IN_KEYWORDS,
  OPT_OUT_KEYWORDS,
  formatClaimInventoryMessage,
  optInMessage,
} from "./sms.model";

import inventoryLib from '../inventory/lib'

import config from '../../config'


export class SMSController {
    findAllPhoneOptIns = async (req: Request, res: Response) => {
        const result = await smsService.findAllPhoneOptIns(req.query as {[key: string]: string[]})
        res.send({
            data: result.map(r => ({
                type: 'phoneOptIn',
                id: r.id,
                attributes: { smsConsent: r.sms_consent },
            }))
        })
    }

    updatePhoneOptIn = async (req: Request, res: Response) => {
        await smsService.updatePhoneOptIn(
            req.body.data.id,
            {
                sms_consent: req.body.data.attributes.smsConsent,
            }
        )
        res.send(req.body)
    }

    postSms = async (req: Request, res: Response) => {
        const postSmsRequestBody = req.body
        if (postSmsRequestBody.data.initialText) {
            const optInStatus = await lib.getOptInStatus(postSmsRequestBody.data.phone)

            let setDateTexted = false

            if (optInStatus === null) {
                // request opt in
                const smsResponse = await sendSms(
                    postSmsRequestBody.data.phone,
                    optInMessage
                )
                setDateTexted = !smsResponse === true
            } else if (optInStatus.sms_consent === 1) {
                // user is opted in, send text
                const sendSmsResponse = await sendSms(
                    postSmsRequestBody.data.phone,
                    postSmsRequestBody.data.message
                )

                setDateTexted = !sendSmsResponse === true

                if (
                    typeof sendSmsResponse === "object" &&
                    "errors" in sendSmsResponse
                ) {
                    return res.status(500).send("Error sending sms")
                }
            } else {
                // phone is opted out
                setDateTexted = true
            }

            if (setDateTexted) {
                await inventoryLib.update(postSmsRequestBody.data.discId, {
                    dateTexted: new Date(new Date().toISOString().split("T")[0]),
                })
            }
        } else {
            // send the text
            const sendSmsResponse = await sendSms(
                postSmsRequestBody.data.phone,
                postSmsRequestBody.data.message
            )

            if (typeof sendSmsResponse === "object" && "errors" in sendSmsResponse) {
                return res.status(500).send("Error sending sms");
            }

            // Log the custom SMS
            await smsService.insertSmsLog({
                disc_id: postSmsRequestBody.data.discId,
                message: postSmsRequestBody.data.message,
                sent_by: postSmsRequestBody.data.userId,
                recipient_phone: postSmsRequestBody.data.phone,
                sent_at: new Date(),
            })
        }

        res.send("Success")
    }

    handleTwilioSms = async (req: Request, res: Response) => {
        try {
            const isTwilio = twilio.validateRequest(
                config.twilioAuthToken,
                req.headers["x-twilio-signature"] as string,
                config.twilioWebhookURL,
                req.body
            )

            if (!isTwilio) {
                console.error("!isTwilio on twilio webhook post")
                return res.status(403).send()
            }

            const phoneNumber = req.body.From
            const message = req.body.Body

            let responseMessage: string = "Thanks for the message - Disc Rescue Network"

            const testMessage = message.trim().toLowerCase()

            if (OPT_OUT_KEYWORDS.includes(testMessage)) {
                await smsService.updatePhoneOptIn(phoneNumber, {
                    sms_consent: 0,
                })

                return res.status(418).send()
            } else {
                const optInStatus = await lib.getOptInStatus(phoneNumber)
                if (OPT_IN_KEYWORDS.includes(testMessage)) {
                    if (optInStatus && optInStatus.sms_consent === 0) {
                        await smsService.updatePhoneOptIn(phoneNumber, {
                            sms_consent: 1,
                        })

                        await sendVCard(
                            phoneNumber,
                            "DRN: Save our contact to make sure you get all the latest updates from Disc Rescue Network!"
                        )
                    }
                } else {
                    if (!optInStatus) {
                        await smsService.updatePhoneOptIn(phoneNumber, {
                            sms_consent: 0,
                        })

                        await sendSms(phoneNumber, optInMessage)
                        return res.status(418).send()
                    } else if (optInStatus.sms_consent === 0) {
                        return res.status(418).send()
                    }
                }
            }

            const currentInventoryForUser = await inventoryLib.getUnclaimedInventory(
                phoneNumber
            )
            responseMessage = formatClaimInventoryMessage(currentInventoryForUser.length)

            const twilioResponse = new twiml.MessagingResponse()
            twilioResponse.message(responseMessage)
            res.type("text/xml").status(200).send(twilioResponse.toString())
        } catch (e) {
            console.error("Error on twilio opt in:", e)
            res.status(500).send()
        }
    }
}


export default new SMSController
