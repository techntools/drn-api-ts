import { Op } from 'sequelize'

import Inventory, { InventoryData } from './models/inventory'

import { Page, PageOptions } from '../../lib/pagination'


export class InventoryService {
    init () {
        return this
    }

    findAll = async (
        pageOptions: PageOptions,
        q: {[key: string]: string[]}
    ) => {
        const where = { ...q, deleted: 0 }

        const query = {
            where,
            offset: pageOptions.offset,
            limit: pageOptions.limit,
            raw: true,
            nest: true
        }

        const result = await Inventory.findAndCountAll(query)

        return new Page(result.rows, result.count, pageOptions)
    }

    findById = async (id: number) => {
        return Inventory.findByPk(id)
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
