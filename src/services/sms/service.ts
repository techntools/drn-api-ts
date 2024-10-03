import { Op } from 'sequelize'

import PhoneOptIn, { PhoneOptInData } from './models/phone-opt-in'
import SMSLogs, { SMSLogsData } from './models/sms-logs'


export class SMSService {
    init () {
        return this
    }

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

    updatePhoneOptIn = async (id: string, data: Partial<PhoneOptInData>) => {
        return PhoneOptIn.upsert({ ...data, id })
    }

    insertSmsLog = async (data: SMSLogsData) => {
        return SMSLogs.create(data)
    }
}


export default new SMSService
