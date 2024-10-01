import { Request, Response } from 'express'

import mysql from '../store/mysql'


export default async function (_: Request, res: Response) {
    try {
        const sequelize = mysql.sequelize
        const readConn = await sequelize.connectionManager.getConnection({ type: 'read' })
        if (!readConn)
            throw new Error('No read connection to database')

        const writeConn = await sequelize.connectionManager.getConnection({ type: 'write' })
        if (!writeConn)
            throw new Error('No write connection to database')

        await sequelize.query('SELECT 1')

        res.send('healthy')
    } catch(err) {
        res.status(500).send('sick')
    }
}
