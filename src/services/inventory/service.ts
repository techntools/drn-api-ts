import { Op } from 'sequelize'

import Inventory, { InventoryData } from './models/inventory'


export class InventoryService {
    findAll = async (query: {[key: string]: string[]}) => {
        const where = { ...query, deleted: 0 }
        return Inventory.findAll({
            where,
            raw: true,
            nest: true
        })
    }

    create = async (data: InventoryData) => {
        return Inventory.create(data)
    }

    update = async (id: number, data: Partial<InventoryData>) => {
        return Inventory.update(data, { where: { id } })
    }

    getUnclaimedInventory = async (phoneNumber: string) => {
        return Inventory.findAll({
            where: {
                phoneNumber: { [Op.like]: '%' + phoneNumber },
                status: ['UNCLAIMED', 'NEW'],
                deleted: 0
            }
        })
    }
}


export default new InventoryService
