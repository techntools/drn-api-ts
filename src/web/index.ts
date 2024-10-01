import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'

import * as OpenApiValidator from "express-openapi-validator"

import course from '../services/course'
import inventory from '../services/inventory'
import brand from '../services/brand'
import disc from '../services/disc'
import sms from '../services/sms'
import ai from '../services/ai'

import config from '../config'
import openApiSpec from '../api.json'

import healthCheck from './healthcheck'


export class Web {
    private app: express.Application

    async init() {
        this.app = express()

        this.addMany([
            compression(),
            logger("dev"),
            bodyParser.json({ limit: '5mb' }),
            bodyParser.urlencoded({ extended: true }),
            helmet(),
            cors({
                allowedHeaders: ['Content-Type', 'Authorization'],
                origin: [...config.appCORS, /\.discrescuenetwork\.com$/],
                methods: ['GET', 'POST', 'PATCH'],
            }),
        ])

        this.app.get('/health-check', healthCheck)

        disc.init()
        brand.init()
        course.init()
        inventory.init()
        sms.init()
        ai.init()

        /**
         * Middleware that enforces in the {@link openApiSpec}
         */
        this.add(OpenApiValidator.middleware({
            apiSpec: openApiSpec as any,
            validateRequests: true,
            validateResponses: true,
            ignorePaths: /.*\/vcf$/
        }))

        this.add(disc.router, disc.basePath)
        this.add(brand.router, brand.basePath)
        this.add(course.router, course.basePath)
        this.add(inventory.router, inventory.basePath)
        this.add(sms.router, sms.basePath)
        this.add(ai.router, ai.basePath)

        return this
    }

    public add(middleware: any, basePath?: string) {
        if (basePath)
            return this.app.use(basePath, middleware)

        this.app.use(middleware)
    }

    public addMany(middlewares: any[]) {
        middlewares.forEach(mw => {
            this.app.use(mw)
        })
    }

    public getRequestListener() {
        return this.app
    }
}


export default new Web
