import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'

import aiService from './service'

import { requireLogin } from '../../web/middleware'


export class AIController extends AppController {
    init () {
        this.basePath = '/ai'

        aiService.init()

        this.router.post('/image', requireLogin, this.extractImageText)

        return this
    }

    extractImageText = async (req: Request, res: Response) => {
        try {
            const result = await aiService.extractImageText(req.body.data.image)
            res.send(result)
        } catch(err) {
            console.log('Failed to extract image text')
            res.status(500).send({ message: 'Failed to extract image text' })
        }
    }
}


export default new AIController
