import { Request, Response } from 'express'

import brandService from './service'


export class BrandController {
    findAll = async (req: Request, res: Response) => {
        const result = await brandService.findAll(req.query.name as string[])
        res.send({
            data: result.map(d => ({
                type: 'brand',
                id: d.BrandID,
                attributes: { BrandName: d.BrandName },
            }))
        })
    }
}


export default new BrandController
