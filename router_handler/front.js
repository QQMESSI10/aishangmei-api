const log4js = require('log4js')

exports.error = (req, res) => {
  try {
    const log4 = require("log4js");
    log4.configure({
      replaceConsole: true,
      appenders: {
        fileout: {
          type: "file",
          filename: __dirname + "/../logs/front",
          pattern: "error.log",
          alwaysIncludePattern: true,
        },
      },
      categories: { default: { appenders: ["fileout"], level: "error" } },
    });
    const logger = log4js.getLogger();
    logger.error(req.body.err);
    res.send("错误日志保存成功");
  } catch(err) {
    console.log(err)
    res.send("错误日志保存失败");
  }
};
