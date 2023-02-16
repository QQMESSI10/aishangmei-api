const { logger, seqError } = require('../utils/utils')
const { Op } = require("sequelize");

const User = require('../db/model/user')

exports.add = (req, res) => {
  User.findOne({
    where: {
      telephone: req.body.telephone,
    }
  }).then(findRes => {
    if (findRes === null) {
      User.create({
        name: req.body.name,
        telephone: req.body.telephone,
        birthday: req.body.birthday
      }).then(creaRes => {
        const { createdAt, updatedAt, ...info } = creaRes.dataValues
        res.okput(info)
      }).catch(creaErr => seqError(creaErr, res))
    } else {
      res.errput('该手机号已被注册，请确认是否已注册或信息是否正确')
    }
  }).catch(findErr => seqError(findErr, res))
}

exports.update = (req, res) => {
  const { id, name, telephone, birthday } = req.body
  if (id) {
    User.update({ name, telephone, birthday }, {
      where: { id }
    }).then(updaRes => {
      res.okput('修改成功')
    }).catch(updaErr => seqError(updaErr, res))
  } else {
    res.errput('未知错误，请联系管理员处理')
  }
}

exports.list = (req, res) => {
  let where = {
    name: {
      [Op.like]: `%${req.body.name || ''}%`
    },
    telephone: {
      [Op.like]: `%${req.body.telephone || ''}%`
    },
  }
  if (req.body.birthday) {
    where.birthday = req.body.birthday
  }
  User.findAndCountAll({
    where,
    offset: req.body.offset,
    limit: req.body.limit,
    order: [
      [req.body.orderBy || 'createdAt', 'DESC']
    ]
  }).then(findRes => {
    res.okput({ total: findRes.count, list: findRes.rows })
  }).catch(findErr => seqError(findErr, res))
}