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

    extractImageText = AppController.asyncHandler(
        async (req: Request) => {
            return aiService.extractImageText(req.body.data.image)
        }
    )
}


export default new AIController
