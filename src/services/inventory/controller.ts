import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'
import { Forbidden } from '../../lib/error'

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

    findAll = AppController.asyncHandler(
        async (req: Request) => {
            const result = await inventoryService.findAll(req.query as {[key: string]: string[]})
            return result.map(d => ({
                type: 'inventory',
                id: d.id,
                attributes: d,
            }))
        }
    )

    findById = AppController.asyncHandler(
        async (req: Request) => {
            return inventoryService.findById(parseInt(req.params.itemId))
        }
    )

    create = AppController.asyncHandler(
        async (req: Request) => {
            const orgCode = req.auth?.payload?.org_code
            if (!orgCode)
                throw new Forbidden('No org code', 'MISSING_ORG_CODE')

            const body = req.body

            const newItem = await inventoryService.create({
                ...body,
                orgCode
            })

            if (body.textImmediately) {
                const unclaimedData = await inventoryService.getUnclaimedInventory(
                    body.phoneNumber
                )

                const optInStatus = await smslib.getOptInStatus(body.phoneNumber);

                let setDateTexted = false
                if (optInStatus === null) {
                    // request opt in
                    const smsResponse = await sendSms(
                        body.phoneNumber,
                        optInMessage
                    )
                    setDateTexted = !smsResponse === true
                } else if (optInStatus.sms_consent === 1) {
                    // user is opted in, send text
                    const smsResponse = await sendSms(
                        body.phoneNumber,
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

            return {
                attributes: newItem.dataValues,
                type: 'inventory',
                id: newItem.id,
            }
        }
    )

    update = AppController.asyncHandler(
        async (req: Request) => {
            const itemId = parseInt(req.params.itemId)

            await inventoryService.update(itemId, req.body)
            return { id: itemId, ...req.body, type: 'inventory' }
        }
    )
}


export default new InventoryController
