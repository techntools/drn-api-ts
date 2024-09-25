import { Request, Response } from 'express'

import brandService from './service'


export class BrandController {
    findAll = async (_: Request, res: Response) => {
        const result = await brandService.findAll()
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
