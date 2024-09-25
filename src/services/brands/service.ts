import Brand from './models/brand'


export class BrandService {
    findAll = async () => {
        return Brand.findAll({
            raw: true,
            nest: true
        })
    }
}


export default new BrandService
