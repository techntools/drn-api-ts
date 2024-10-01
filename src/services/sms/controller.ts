import { Request, Response } from 'express'
import twilio, { twiml } from 'twilio'

import AppController from '../../lib/app-controller'
import { Forbidden, InternalServerError } from '../../lib/error'

import smsService from './service'
import lib from './lib'

import { sendSms, sendVCard } from '../sms/twilio.service'
import {
  OPT_IN_KEYWORDS,
  OPT_OUT_KEYWORDS,
  formatClaimInventoryMessage,
  optInMessage,
} from './sms.model';

import inventoryLib from '../inventory/lib'

import config from '../../config'

import { requireLogin } from '../../web/middleware'

import { vcard } from "../../vcard"


export class SMSController extends AppController {
    init () {
        this.basePath = '/sms'

        smsService.init()

        this.router.get('/phone-opt-ins/twilio/vcf', async (_, res) => {
            res.setHeader('Content-Type', 'text/vcard')
            res.send(vcard)
        })
        this.router.post('/phone-opt-ins/twilio', this.handleTwilioSms)
        this.router.get('/phone-opt-ins', this.findAllPhoneOptIns)
        this.router.put("/phone-opt-ins", requireLogin, this.updatePhoneOptIn)

        this.router.post('', requireLogin, this.postSms)

        return this
    }

    findAllPhoneOptIns = AppController.asyncHandler(
        async (req: Request) => {
            const result = await smsService.findAllPhoneOptIns(req.query as {[key: string]: string[]})
            return result.map(r => ({
                type: 'phoneOptIn',
                id: r.id,
                attributes: { smsConsent: r.sms_consent },
            }))
        }
    )

    updatePhoneOptIn = AppController.asyncHandler(
        async (req: Request) => {
            await smsService.updatePhoneOptIn(
                req.body.data.id,
                {
                    sms_consent: req.body.data.attributes.smsConsent,
                }
            )
            return req.body
        }
    )

    postSms = AppController.asyncHandler(
        async (req: Request) => {
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
                        throw new InternalServerError('Error sending sms')
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
                    throw new InternalServerError('Error sending sms')
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

            return 'Successfully opted for SMS'
        }
    )

    handleTwilioSms = AppController.asyncHandler(
        async (req: Request) => {
            const isTwilio = twilio.validateRequest(
                config.twilioAuthToken,
                req.headers["x-twilio-signature"] as string,
                config.twilioWebhookURL,
                req.body
            )

            if (!isTwilio)
                throw new Forbidden('Invalid twilio signature')

            const phoneNumber = req.body.From
            const message = req.body.Body

            let responseMessage: string = "Thanks for the message - Disc Rescue Network"

            const testMessage = message.trim().toLowerCase()

            if (OPT_OUT_KEYWORDS.includes(testMessage)) {
                await smsService.updatePhoneOptIn(phoneNumber, {
                    sms_consent: 0,
                })

                return 'Successfully opted out of SMS'
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

                        throw new Forbidden('You have not opted for SMS. Please check SMS to opt in.')
                    } else if (optInStatus.sms_consent === 0) {
                        throw new Forbidden('You have not opted for SMS')
                    }
                }
            }

            const currentInventoryForUser = await inventoryLib.getUnclaimedInventory(
                phoneNumber
            )
            responseMessage = formatClaimInventoryMessage(currentInventoryForUser.length)

            const twilioResponse = new twiml.MessagingResponse().message(responseMessage)
            return { xml: twilioResponse.toString() }
        }
    )
}


export default new SMSController
