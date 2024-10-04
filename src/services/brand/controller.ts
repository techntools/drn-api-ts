import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'
import oapi, { oapiPathDef, paginatedResponse } from '../../lib/openapi'

import brandService from './service'
import generate from './openapi-schema'


export class BrandController extends AppController {
    init () {
        const schemas = generate()

        const GetBrandSchema = schemas.GetBrandSchema

        this.basePath = '/brands'

        brandService.init()

        this.router.get(
            '',
            oapi.validPath(oapiPathDef({
                responseData: paginatedResponse(GetBrandSchema),
                summary: 'Get Brands'
            })),
            this.findAll
        )

        return this
    }

    findAll = AppController.asyncHandler(
        async (req: Request) => {
            return brandService.findAll(req.query.name as string[])
        }
    )
}


export default new BrandController
