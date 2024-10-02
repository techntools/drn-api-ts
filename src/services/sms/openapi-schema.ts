import { SchemaManager, OpenApiStrategy } from '@techntools/sequelize-to-openapi'

import PhoneOptIn from './models/phone-opt-ins'


export default function () {
    const schemaManager = new SchemaManager
    const strategy = new OpenApiStrategy

    const CreatePhoneOptInSchema = {
        type: 'object',
        required: [
            'phone',
            'message',
            'initialText',
            'discId',
            'userId'
        ],
        properties: {
            phone: {
                type: 'string',
                example: '7099554266'
            },
            message: {
                type: 'string',
                example: 'Say Hi',
                minLength: 1
            },
            initialText: {
                type: 'integer',
                enum: [1, 0],
            },
            discId: {
                type: 'integer',
                minimum: 1
            },
            userId: {
                type: 'string',
                minLength: 1
            }
        }
    }

    const UpdatePhoneOptInSchema = schemaManager.generate(PhoneOptIn, strategy, {
        associations: false
    })

    const GetPhoneOptInSchema = schemaManager.generate(PhoneOptIn, strategy, {
        associations: false
    })

    const TwilioSMSSchema = {
        type: 'object',
        properties: {
            From: {
                type: 'string',
                example: '7099554266'
            },
            Body: {
                type: 'string',
                example: 'Say Hi'
            }
        }
    }

    return {
        CreatePhoneOptInSchema,
        UpdatePhoneOptInSchema,
        GetPhoneOptInSchema,
        TwilioSMSSchema,
    }
}
