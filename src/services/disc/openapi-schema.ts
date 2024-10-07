import { SchemaManager, OpenApiStrategy } from '@techntools/sequelize-to-openapi'

import Disc from './models/disc'


export default function () {
    const schemaManager = new SchemaManager
    const strategy = new OpenApiStrategy

    const GetDiscSchema = schemaManager.generate(Disc, strategy, {
        associations: false
    })

    return {
        GetDiscSchema,
    }
}
