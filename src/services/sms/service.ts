import { Op } from 'sequelize'

import PhoneOptIn from './models/phone-opt-ins'


export class SMSService {
    findAllPhoneOptIns = async (query: {[key: string]: string[]}) => {
        const where: {} = {}

        if (query.phone)
            where['id'] = { [Op.in]: query.phone.map(phone => '+' + phone.trim()) }

        if (query.smsConsent)
            where['sms_consent'] = { [Op.in]: query.smsConsent }

        return PhoneOptIn.findAll({
            where,
            raw: true,
            nest: true
        })
    }
}


export default new SMSService
