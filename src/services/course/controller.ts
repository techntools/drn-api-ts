import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'

import courseService from './service'


export class CourseController extends AppController {
    init () {
        this.basePath = '/courses'

        courseService.init()

        this.router.get('', this.findAll)

        return this
    }

    findAll = AppController.asyncHandler(
        async (req: Request) => {
            const result = await courseService.findAll(req.query as {[key: string]: string[]})
            return result.map(r => ({
                type: 'course',
                id: r.orgCode,
                attributes: r,
            }))
        }
    )
}


export default new CourseController
