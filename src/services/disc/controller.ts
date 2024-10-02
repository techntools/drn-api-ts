import { Request, Response } from 'express'

import AppController from '../../lib/app-controller'
import oapi, { oapiPathDef, paginatedResponse } from '../../lib/openapi'

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
        async (_: Request) => {
            const result = await discService.findAll()
            return result.map(d => ({
                type: 'disc',
                id: d.MoldID,
                attributes: {
                    MoldName: d.MoldName,
                    BrandID: d.BrandID,
                    BrandName: d.brand?.BrandName,
                },
            }))
        }
    )
}


export default new DiscController
