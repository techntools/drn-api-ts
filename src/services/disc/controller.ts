import { Request, Response } from 'express'

import { plainToClass } from 'class-transformer'

import AppController from '../../lib/app-controller'
import oapi, { oapiPathDef, paginatedResponse } from '../../lib/openapi'
import { PageOptions } from '../../lib/pagination'

import discService from './service'
import generate from './openapi-schema'


export class DiscController extends AppController {
    init () {
        const schemas = generate()

        const GetDiscSchema = schemas.GetDiscSchema

        this.basePath = '/discs'

        discService.init()

        this.router.get(
            '',
            oapi.validPath(oapiPathDef({
                responseData: paginatedResponse(GetDiscSchema),
                summary: 'Get Discs'
            })),
            this.findAll
        )

        return this
    }

    findAll = AppController.asyncHandler(
        async (req: Request) => {
            return discService.findAll(
                plainToClass(PageOptions, req.query),
                req.query.q as string
            )
        }
    )
}


export default new DiscController
