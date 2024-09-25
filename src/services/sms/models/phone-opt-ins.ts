import { PrimaryKey, Column, Table, Model } from 'sequelize-typescript'


@Table({
    tableName: 'phone_opt_ins'
})
export default class PhoneOptIn extends Model {
    @PrimaryKey
    @Column
    id: string

    @Column
    sms_consent: string
}


export type PhoneOptInData = Omit<PhoneOptIn, keyof Model>
