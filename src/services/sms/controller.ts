import { Request, Response } from 'express'

import smsService from './service'
import lib from './lib'

import { sendSms } from "../sms/twilio.service";
import { optInMessage } from "../sms/sms.model";

import inventoryLib from '../inventory/lib'


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
}


export default new SMSController
