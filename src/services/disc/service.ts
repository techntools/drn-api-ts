import Brand from '../brand/models/brand'

import DiscMold from './models/disc'


export class DiscService {
    init () {
        return this
    }

    findAll = async () => {
        return DiscMold.findAll({
            include: Brand,
            raw: true,
            nest: true
        })
    }
}


export default new DiscService
