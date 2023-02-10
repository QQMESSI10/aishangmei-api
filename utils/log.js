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

const logger = (type, msg, label) => {
  const logger = log4js.getLogger(label | 'access');
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

module.exports = logger