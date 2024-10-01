import { Op } from 'sequelize'

import Course from './models/course'


export class CourseService {
    init () {
        return this
    }

    findAll = async (query: {[key: string]: string[]}) => {
        const where: {} = {}

        if (query.orgCode)
            where['orgCode'] = { [Op.in]: query.orgCode }

        if (query.activeForLostAndFound)
            where['activeForLostAndFound'] = { [Op.in]: query.activeForLostAndFound }

        if (query.courseName)
            where['courseName'] = { [Op.in]: query.courseName }

        if (query.state)
            where['state'] = { [Op.in]: query.state }

        if (query.city)
            where['city'] = { [Op.in]: query.city }

        if (query.shortCode)
            where['shortCode'] = { [Op.in]: query.shortCode }

        if (query.createdAt)
            where['createdAt'] = { [Op.in]: query.createdAt }

        if (query.updatedAt)
            where['updatedAt'] = { [Op.in]: query.updatedAt }

        if (query.shortLink)
            where['shortLink'] = { [Op.in]: query.shortLink }

        if (query.link)
            where['link'] = { [Op.in]: query.link }

        if (query.udiscLeagueURL)
            where['udiscLeagueURL'] = { [Op.in]: query.udiscLeagueURL }

        return Course.findAll({
            where,
            raw: true,
            nest: true
        })
    }
}


export default new CourseService
