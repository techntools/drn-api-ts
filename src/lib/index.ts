import util from 'util'


global.logObject = function (obj: any) {
  console.log(util.inspect(obj, { depth: null }))
}
