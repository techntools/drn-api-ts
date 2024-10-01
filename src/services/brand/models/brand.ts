import { PrimaryKey, Column, Table, Model } from 'sequelize-typescript'


@Table({
    tableName: 'brands'
})
export default class Brand extends Model {
    @PrimaryKey
    @Column
    BrandID: number

    @Column
    BrandName: string
}


export type BrandData = Omit<Brand, keyof Model>
