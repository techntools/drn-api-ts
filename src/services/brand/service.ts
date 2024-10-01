import { Op } from 'sequelize'

import Brand from './models/brand'


export class BrandService {
    init () {
        return this
    }

    findAll = async (names?: string[]) => {
        const where: {} = {}
        if (names)
            where['BrandName'] = { [Op.in]: names }

        return Brand.findAll({
            where,
            raw: true,
            nest: true
        })
    }
}


export default new BrandService
