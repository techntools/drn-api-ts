import { Request, Response } from 'express'

import inventoryService from './service'


export class InventoryController {
    findAll = async (req: Request, res: Response) => {
        const result = await inventoryService.findAll(req.query as {[key: string]: string[]})
        res.send({
            data: result.map(d => ({
                type: 'inventory',
                id: d.id,
                attributes: d,
            }))
        })
    }
}


export default new InventoryController
