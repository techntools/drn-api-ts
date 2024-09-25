import { PrimaryKey, Column, Table, Model } from 'sequelize-typescript'


@Table({
    tableName: 'courses',
    timestamps: true
})
export default class Course extends Model {
    @PrimaryKey
    @Column
    orgCode: string

    @Column
    courseName: string

    @Column
    state: string

    @Column
    city: string

    @Column
    shortCode: string

    @Column
    activeForLostAndFound: boolean

    @Column
    shortLink: string

    @Column
    link: string

    @Column
    udiscLeagueURL: string
}


export type CourseData = Omit<Course, keyof Model>
