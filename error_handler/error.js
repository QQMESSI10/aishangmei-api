const joi = require('joi')

const errorHandler = (err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    return res.output(err)
  } else {
    return res.output('未知系统异常，请联系管理员处理！')
  }
  console.log(err)
  res.output(err)
  next()
}

module.exports = errorHandler