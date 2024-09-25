import { Request, Response } from 'express'

import smsService from './service'


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
}


export default new SMSController
