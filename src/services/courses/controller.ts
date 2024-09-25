import { Request, Response } from 'express'

import courseService from './service'


export class CourseController {
    findAll = async (req: Request, res: Response) => {
        const result = await courseService.findAll(req.query as {[key: string]: string[]})
        res.send({
            data: result.map((r) => {
                return {
                    type: 'course',
                    id: r.orgCode,
                    attributes: r,
                };
            })
        })
    }
}


export default new CourseController
