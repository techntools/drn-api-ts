import Inventory from './models/inventory'


export class InventoryService {
    findAll = async (query: {[key: string]: string[]}) => {
        const where = query
        return Inventory.findAll({
            where,
            raw: true,
            nest: true
        })
    }
}


export default new InventoryService
