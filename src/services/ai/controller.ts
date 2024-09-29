import { Request, Response } from 'express'

import aiService from './service'


export class DiscController {
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


export default new DiscController
