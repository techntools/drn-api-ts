import { BelongsTo, ForeignKey, PrimaryKey, Column, Table, Model } from 'sequelize-typescript'

import Brand from '../../brand/models/brand'


@Table({
    tableName: 'disc_molds'
})
export default class DiscMold extends Model {
    @PrimaryKey
    @Column
    MoldID: number

    @Column
    MoldName: string

    @Column
    PlasticType: string

    @Column
    Category: string

    @ForeignKey(() => Brand)
    @Column
    BrandID: number;

    @BelongsTo(() => Brand)
    brand: Brand
}


export type DiscMoldData = Omit<DiscMold, keyof Model>
