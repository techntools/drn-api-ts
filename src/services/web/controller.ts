import { Request, Response } from 'express'

import webService from './service'


export class WebController {
    healthCheck = async (_: Request, res: Response) => {
        try {
            await webService.healthCheck()
            res.send('healthy')
        } catch(err) {
            res.status(500).send('sick')
        }
    }
}


export default new WebController
