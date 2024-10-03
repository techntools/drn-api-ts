import { isMobilePhone } from 'validator'


export class StoreLib {
  static isUrl = {
    isUrl: {
      msg: 'needs to be valid url'
    }
  }
  static isMobilePhone = {
      isMobilePhone(value: string) {
          return isMobilePhone(value, ['en-US', 'en-IN'])
      }
  }
}


export default new StoreLib
