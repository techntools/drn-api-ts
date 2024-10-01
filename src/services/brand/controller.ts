import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'

import brandService from './service'


export class BrandController extends AppController {
    init () {
        this.basePath = '/brands'

        brandService.init()

        this.router.get('', this.findAll)

        return this
    }

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
