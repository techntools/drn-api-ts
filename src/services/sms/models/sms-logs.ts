import { DataType, Column, Table, Model } from 'sequelize-typescript'


@Table({
    tableName: 'sms_logs'
})
export default class SMSLogs extends Model {
    @Column
    disc_id: number

    @Column({
        type: DataType.TEXT
    })
    message: string

    @Column
    sent_by: string

    @Column
    recipient_phone: string

    @Column
    sent_at: Date
}


export type SMSLogsData = Omit<SMSLogs, keyof Model>
