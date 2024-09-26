import { Sequelize } from 'sequelize-typescript'

import envConfig from '../config'


export class MySQL {
    async init() {
        const { dialect, name, host, username, password } = envConfig.dbConfig

        const sequelize = new Sequelize(
            name,
            username,
            password,
            {
                host,
                dialect,
                define: { timestamps: false }
            }
        )

        sequelize.addModels([__dirname + '/../**/models/*.js'])

        if (process.env.DB_SYNC)
            sequelize.sync({ alter: true })

        return sequelize
    }
}


export default new MySQL
