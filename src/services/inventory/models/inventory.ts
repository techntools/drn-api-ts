import { DataType, Column, Table, Model } from 'sequelize-typescript'


@Table({
    tableName: 'found_discs'
})
export default class Inventory extends Model {
    @Column
    course: string

    @Column
    name: string

    @Column
    disc: string

    @Column({
        type: DataType.STRING(15)
    })
    phoneNumber: string

    @Column({
        type: DataType.STRING(10)
    })
    bin: string

    @Column({
        type: DataType.DATEONLY
    })
    dateFound: Date

    @Column({
        type: DataType.DATEONLY
    })
    dateTexted: Date

    @Column({
        type: DataType.DATEONLY
    })
    dateClaimed: Date

    @Column({
        type: DataType.ENUM(
            'UNCLAIMED',
            'PENDING_DROPOFF',
            'PENDING_STORE_PICKUP',
            'PENDING_COURSE_PICKUP',
            'PICKUP_OVERDUE',
            'FOR_SALE',
            'CLAIMED',
            'SOLD',
            'SOLD_OFFLINE',
            'SURRENDERED'
        )
    })
    status: string

    @Column({
        type: DataType.TEXT
    })
    comments: string

    @Column
    color: string

    @Column({
        type: DataType.DATEONLY
    })
    claimBy: Date

    @Column
    brand: string

    @Column
    dateSold: Date

    @Column
    topImage: string

    @Column
    bottomImage: string

    @Column({
        type: DataType.BOOLEAN
    })
    deleted: boolean

    @Column
    category: string

    @Column
    subcategory: string

    @Column
    orgCode: string

    @Column
    dateOfReminderText: Date
}


export type InventoryData = Omit<Inventory, keyof Model>
