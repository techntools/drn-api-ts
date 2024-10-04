import { Request, Response } from 'express'
import twilio, { twiml } from 'twilio'

import AppController from '../../lib/app-controller'
import { Forbidden, InternalServerError } from '../../lib/error'
import oapi, { oapiPathDef, paginatedResponse } from '../../lib/openapi'

import smsService from './service'
import generate from './openapi-schema'
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
        const schemas = generate()

        this.basePath = '/sms'

        smsService.init()

        this.router.get('/phone-opt-ins/twilio/vcf', async (_, res) => {
            res.setHeader('Content-Type', 'text/vcard')
            res.send(vcard)
        })

        this.router.post(
            '/phone-opt-ins/twilio',
            oapi.validPath(oapiPathDef({
                requestBodySchema: schemas.TwilioSMSSchema,
                summary: 'Send Twilio SMS'
            })),
            this.handleTwilioSms
        )

        this.router.put(
            '/phone-opt-ins',
            requireLogin,
            oapi.validPath(oapiPathDef({
                requestBodySchema: schemas.UpdatePhoneOptInSchema,
                summary: 'Update Phone Opt In'
            })),
            this.updatePhoneOptIn
        )

        this.router.post(
            '',
            requireLogin,
            oapi.validPath(oapiPathDef({
                requestBodySchema: schemas.CreatePhoneOptInSchema,
                summary: 'Opt In To SMS'
            })),
            this.postSms
        )

        this.router.get(
            '/phone-opt-ins',
            oapi.validPath(oapiPathDef({
                responseData: paginatedResponse(schemas.GetPhoneOptInSchema),
                summary: 'Get Phone Opt In'
            })),
            this.findAllPhoneOptIns
        )

        return this
    }

    findAllPhoneOptIns = AppController.asyncHandler(
        async (req: Request) => {
            const result = await smsService.findAllPhoneOptIns(req.query as {[key: string]: string[]})
            return result.map(r => ({
                type: 'phoneOptIn',
                id: r.id,
                attributes: { smsConsent: r.smsConsent },
            }))
        }
    )

    updatePhoneOptIn = AppController.asyncHandler(
        async (req: Request) => {
            return smsService.updatePhoneOptIn(req.body)
        }
    )

    postSms = AppController.asyncHandler(
        async (req: Request) => {
            const reqBody = req.body
            if (reqBody.initialText) {
                const optInStatus = await lib.getOptInStatus(reqBody.phone)

                let setDateTexted = false

                if (optInStatus === null) {
                    // request opt in
                    const smsResponse = await sendSms(
                        reqBody.phone,
                        optInMessage
                    )
                    setDateTexted = !smsResponse === true
                } else if (optInStatus.smsConsent) {
                    // user is opted in, send text
                    const sendSmsResponse = await sendSms(
                        reqBody.phone,
                        reqBody.message
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
                    await inventoryLib.update(reqBody.discId, {
                        dateTexted: new Date(new Date().toISOString().split("T")[0]),
                    })
                }
            } else {
                // send the text
                const sendSmsResponse = await sendSms(
                    reqBody.phone,
                    reqBody.message
                )

                if (typeof sendSmsResponse === "object" && "errors" in sendSmsResponse) {
                    throw new InternalServerError('Error sending sms')
                }

                // Log the custom SMS
                await smsService.insertSmsLog({
                    ...reqBody,
                    sentAt: new Date(),
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
                await smsService.updatePhoneOptIn({
                    phoneNumber,
                    smsConsent: false,
                })

                return 'Successfully opted out of SMS'
            } else {
                const optInStatus = await lib.getOptInStatus(phoneNumber)
                if (OPT_IN_KEYWORDS.includes(testMessage)) {
                    if (optInStatus && !optInStatus.smsConsent) {
                        await smsService.updatePhoneOptIn({
                            phoneNumber,
                            smsConsent: true,
                        })

                        await sendVCard(
                            phoneNumber,
                            "DRN: Save our contact to make sure you get all the latest updates from Disc Rescue Network!"
                        )
                    }
                } else {
                    if (!optInStatus) {
                        await smsService.updatePhoneOptIn({
                            phoneNumber,
                            smsConsent: false,
                        })

                        await sendSms(phoneNumber, optInMessage)

                        throw new Forbidden('You have not opted for SMS. Please check SMS to opt in.')
                    } else if (!optInStatus.smsConsent) {
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
