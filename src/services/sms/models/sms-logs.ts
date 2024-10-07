import { BelongsTo, ForeignKey, DataType, Column, Table, Model, Length } from 'sequelize-typescript'

import { StoreLib } from '../../../store/lib'

import DiscMold from '../../disc/models/disc'
import UserAccount from '../../user/models/account'


@Table
export default class SMSLogs extends Model {
    @ForeignKey(() => DiscMold)
    @Column({
        allowNull: false
    })
    discId: number

    @BelongsTo(() => DiscMold)
    disc?: DiscMold

    @Length({
        msg: 'length needs to be between 1 and 160',
        min: 1,
        max: 160
    })
    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    message: string

    @Column({
        allowNull: false,
        validate: StoreLib.isMobilePhone
    })
    recipientPhone: string

    @ForeignKey(() => UserAccount)
    @Column({
        allowNull: false
    })
    sentBy: string

    @BelongsTo(() => UserAccount, { targetKey: 'kindeId', onDelete: 'CASCADE' })
    sender?: UserAccount

    @Column({
        allowNull: false
    })
    sentAt: Date
}


export type SMSLogsData = Omit<SMSLogs, keyof Model>
