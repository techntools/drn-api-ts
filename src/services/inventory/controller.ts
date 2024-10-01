import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'

import inventoryService from './service'

import smslib from '../sms/lib'
import { sendSms } from "../sms/twilio.service"
import { formatClaimInventoryMessage, optInMessage } from "../sms/sms.model"

import { requireLogin, requireOrgAuth } from '../../web/middleware'


export class InventoryController extends AppController {
    public service = inventoryService

    init () {
        this.basePath = '/inventory'

        inventoryService.init()

        this.router.patch(
            '/:itemId',
            requireLogin,
            requireOrgAuth(async (req) => {
                const item = await this.service.findById(parseInt(req.params.itemId))
                if (item)
                    return item.orgCode
                return null
            }),
            this.update
        )
        this.router.post('', requireLogin, this.create)
        this.router.get('', this.findAll)

        return this
    }

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

    findById = async (req: Request, res: Response) => {
        const result = await inventoryService.findById(parseInt(req.params.itemId))
        res.send(result)
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

    update = async (req: Request, res: Response) => {
        const itemId = parseInt(req.params.itemId)

        await inventoryService.update(itemId, req.body.data.attributes)
        res.send({ data: { id: itemId, ...req.body.data, type: 'inventory' } })
    }
}


export default new InventoryController
