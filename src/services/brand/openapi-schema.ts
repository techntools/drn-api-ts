import { SchemaManager, OpenApiStrategy } from '@techntools/sequelize-to-openapi'

import Brand from './models/brand'


export default function () {
    const schemaManager = new SchemaManager
    const strategy = new OpenApiStrategy

    const GetBrandSchema = schemaManager.generate(Brand, strategy, {
        associations: false
    })

    return {
        GetBrandSchema,
    }
}
