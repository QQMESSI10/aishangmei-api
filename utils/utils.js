// logger  日志
const log4js = require('log4js')
log4js.configure({
  replaceConsole: true,
  appenders: {
    fileout: {
      type: 'DateFile',
      filename: __dirname + '/../logs/logs',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
  },
  categories: { default: { appenders: [ 'fileout' ], level: 'info' } }
})
exports.logger = (type, msg, label) => {
  const logger = log4js.getLogger(label || 'default');
  switch (type) {
    case 'error': 
      logger.error(msg)
      break;
    case 'info':
      logger.info(msg)
      break;
    case 'warn':
      logger.warn(msg)
      break;
    default:
      logger.info(msg)
      break;
  }
}

// seqError 错误处理
exports.seqError = (err, res) => {
  console.log(err)
  this.logger('error', err)
  res.errput('未知错误异常，请联系管理员处理！')
}