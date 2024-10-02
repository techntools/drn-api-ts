import { SchemaManager, OpenApiStrategy } from '@techntools/sequelize-to-openapi'

import Inventory from './models/inventory'

import config from '../../config'


export default function () {
    const schemaManager = new SchemaManager
    const strategy = new OpenApiStrategy

    const CreateInventorySchema = schemaManager.generate(Inventory, strategy, {
        exclude: [
            'status',
            'dateSold',
            'deleted',
            'orgCode',
            'dateClaimed',
            'dateTexted',
            ...config.autoAttributes
        ],
        associations: false
    })

    const UpdateInventorySchema = CreateInventorySchema

    const GetInventorySchema = schemaManager.generate(Inventory, strategy, {
        associations: false
    })

    return {
        CreateInventorySchema,
        UpdateInventorySchema,
        GetInventorySchema,
    }
}
