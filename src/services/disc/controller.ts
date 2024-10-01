import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'

import discService from './service'


export class DiscController extends AppController {
    init () {
        this.basePath = '/discs'

        discService.init()

        this.router.get('', this.findAll)

        return this
    }

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
