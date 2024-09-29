import mysql from '../../store/mysql'


export class BrandService {
    healthCheck = async () => {
        const sequelize = mysql.sequelize
        const readConn = await sequelize.connectionManager.getConnection({ type: 'read' })
        if (!readConn)
            throw new Error('No read connection to database')

        const writeConn = await sequelize.connectionManager.getConnection({ type: 'write' })
        if (!writeConn)
            throw new Error('No write connection to database')

        await sequelize.query('SELECT 1')
    }
}


export default new BrandService
