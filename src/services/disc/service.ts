import Sequelize from 'sequelize'

import Brand from '../brand/models/brand'

import DiscMold from './models/disc'

import { Page, PageOptions } from '../../lib/pagination'


export class DiscService {
    init () {
        return this
    }

    findAll = async (
        pageOptions: PageOptions,
        q?: string
    ) => {
        const where: {} = {}
        const include: any[] = [Brand]

        if (q)
            where['_'] = Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('DiscMold.name')), 'LIKE', '%' + q.toLocaleLowerCase() + '%')

        const query = {
            where,
            include,
            offset: pageOptions.offset,
            limit: pageOptions.limit,
            raw: true,
            nest: true
        }

        const result = await DiscMold.findAndCountAll(query)

        return new Page(result.rows, result.count, pageOptions)
    }
}


export default new DiscService
