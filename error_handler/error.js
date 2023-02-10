const joi = require('joi')

const errorHandler = (err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    return res.errput(err)
  } else {
    return res.errput('未知系统异常，请联系管理员处理！')
  }
}

module.exports = errorHandler