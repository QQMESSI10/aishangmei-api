const { logger, seqError } = require('../utils/utils')
const { Op } = require("sequelize");

const Server = require('../db/model/server')

exports.list = (req, res) => {
  Server.findAndCountAll({
    where: {
      name: {
        [Op.like]: `%${req.body.name || ''}%`
      }, 
    },
    offset: req.body.offset,
    limit: req.body.limit,
    order: [
      [req.body.orderBy || 'createdAt', 'DESC']
    ]
  }).then(findRes => {
    res.okput({ total: findRes.count, list: findRes.rows })
  }).catch(findErr => seqError(findErr, res))
}

exports.add = (req, res) => {
  Server.findOne({
    where: {
      name: req.body.name
    }
  }).then(findRes => {
    if (findRes === null) {
      Server.create({
        name: req.body.name,
      }).then(creaRes => {
        const { createdAt, updatedAt, ...info } = creaRes.dataValues
        res.okput(info)
      }).catch(creaErr => seqError(creaErr, res))
    } else {
      res.errput('该服务人员已存在')
    }
  }).catch(findErr => seqError(findErr, res))
}