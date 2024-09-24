import mysql from './mysql'

import { AsyncFunction } from '../lib/types'


export class Store {
    private users: {[key: string]: AsyncFunction} = {}

    async init() {
        await mysql.init()
        return this
    }

    async registerCallback(key: string, callback: AsyncFunction) {
        return this.users[key] = callback
    }

    async close() {
        for (const callback of Object.values(this.users)) {
            await callback()
        }
    }
}


export default new Store
