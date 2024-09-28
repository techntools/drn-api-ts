import Inventory, { InventoryData } from './models/inventory'


export class InventoryLib {
    update = async (id: number, data: Partial<InventoryData>) => {
        return Inventory.update(data, { where: { id } })
    }
}


export default new InventoryLib
