import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'
import oapi, { oapiPathDef, paginatedResponse } from '../../lib/openapi'

import courseService from './service'
import generate from './openapi-schema'


export class CourseController extends AppController {
    init () {
        const schemas = generate()

        const GetCourseSchema = schemas.GetCourseSchema

        this.basePath = '/courses'

        courseService.init()

        this.router.get(
            '',
            oapi.validPath(oapiPathDef({
                responseData: paginatedResponse(GetCourseSchema),
                summary: 'Get Courses'
            })),
            this.findAll
        )

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
