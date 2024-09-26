import { Dialect } from 'sequelize'

import { validateOrReject, IsArray, IsInt, IsString } from 'class-validator'


export class DatabaseConfig {
    @IsString()
    dialect: Dialect

    @IsString()
    name: string

    @IsString()
    host: string

    @IsString()
    username: string

    @IsString()
    password: string
}


export class EnvConfig {
    @IsInt()
    port: number

    @IsArray()
    autoAttributes: string[]

    dbConfig: DatabaseConfig

    async init() {
        this.port = parseInt(process.env.APP_PORT)

        this.autoAttributes = [
            'id',
            'createdAt',
            'updatedAt',
        ]

        this.dbConfig = new DatabaseConfig
        this.dbConfig.dialect = process.env.DB_DIALECT as Dialect
        this.dbConfig.name = process.env.DB_NAME
        this.dbConfig.host = process.env.DB_HOST
        this.dbConfig.username = process.env.DB_USER
        this.dbConfig.password = process.env.DB_PASSWORD

        Object.freeze(this)

        await validateOrReject(this.dbConfig)
        await validateOrReject(this)
    }
}


export default new EnvConfig;
