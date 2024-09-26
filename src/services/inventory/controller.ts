import { Request, Response } from 'express'

import inventoryService from './service'

import smslib from '../sms/lib'
import { sendSms } from "../sms/twilio.service";
import { formatClaimInventoryMessage, optInMessage } from "../sms/sms.model";


export class InventoryController {
    findAll = async (req: Request, res: Response) => {
        const result = await inventoryService.findAll(req.query as {[key: string]: string[]})
        res.send({
            data: result.map(d => ({
                type: 'inventory',
                id: d.id,
                attributes: d,
            }))
        })
    }

    create = async (req: Request, res: Response) => {
        const orgCode = req.auth?.payload?.org_code
        if (!orgCode)
            return res.status(403).send({ code: 'MISSING_ORG_CODE', message: 'No org code' })

        const body = req.body

        const newItem = await inventoryService.create({
            ...body.data.attributes,
            orgCode
        })

        if (body.data.attributes.textImmediately) {
            const unclaimedData = await inventoryService.getUnclaimedInventory(
                body.data.attributes.phoneNumber
            )

            const optInStatus = await smslib.getOptInStatus(body.data.attributes.phoneNumber);

            let setDateTexted = false
            if (optInStatus === null) {
                // request opt in
                const smsResponse = await sendSms(
                    body.data.attributes.phoneNumber,
                    optInMessage
                )
                setDateTexted = !smsResponse === true
            } else if (optInStatus.sms_consent === 1) {
                // user is opted in, send text
                const smsResponse = await sendSms(
                    body.data.attributes.phoneNumber,
                    formatClaimInventoryMessage(unclaimedData.length)
                )
                setDateTexted = !smsResponse === true
            } else {
                // phone is opted out
                setDateTexted = true
            }

            if (setDateTexted) {
                await inventoryService.update(newItem.id, {
                    dateTexted: new Date(new Date().toISOString().split("T")[0]),
                })
            }
        }

        res.send({
            data: {
                attributes: newItem.dataValues,
                type: 'inventory',
                id: newItem.id,
            },
        })
    }
}


export default new InventoryController
