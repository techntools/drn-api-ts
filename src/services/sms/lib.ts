import { Op } from 'sequelize'

import PhoneOptIn from './models/phone-opt-in'


export class SMSlib {
    getOptInStatus = async (phoneNumber: string) => {
        return PhoneOptIn.findOne({
            where: { id: { [Op.like]: '%' + phoneNumber } },
            raw: true,
        })
    }
}


export default new SMSlib
