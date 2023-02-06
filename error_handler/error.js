const joi = require('joi')

const errorHandler = (err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    console.log(req.url)
    return res.output(err)
  }
  res.output(err)
  next()
}

module.exports = errorHandler