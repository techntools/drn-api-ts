import Brand from '../brands/models/brand'

import DiscMold from './models/disc'


export class DiscService {
    findAll = async () => {
        return DiscMold.findAll({
            include: Brand,
            raw: true,
            nest: true
        })
    }
}


export default new DiscService
