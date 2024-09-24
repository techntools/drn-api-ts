import { Request, Response } from 'express'

import discService from './service'


export class DiscController {
    findAll = async (_: Request, res: Response) => {
        const result = await discService.findAll()
        res.send({
            data: result.map(d => ({
                type: 'disc',
                id: d.MoldID,
                attributes: {
                    MoldName: d.MoldName,
                    BrandID: d.BrandID,
                    BrandName: d.brand?.BrandName,
                },
            }))
        })
    }
}


export default new DiscController
