const { logger, seqError } = require('../utils/utils')
const { Op } = require("sequelize");

const Project = require('../db/model/project')
const RechargeProject = require('../db/model/rechargeProject')

exports.list = (req, res) => {
  Project.findAndCountAll({
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

exports.userProject = (req, res) => {
  RechargeProject.findAll({
    where: {
      userId: req.body.userId,
      consumeId: null
    },
  }).then(findRes => {
    res.okput(findRes)
  }).catch(findErr => seqError(findErr, res))
}

exports.add = (req, res) => {
  Project.findOne({
    where: {
      name: req.body.name
    }
  }).then(findRes => {
    if (findRes === null) {
      Project.create({
        name: req.body.name,
      }).then(creaRes => {
        const { createdAt, updatedAt, ...info } = creaRes.dataValues
        res.okput(info)
      }).catch(creaErr => seqError(creaErr, res))
    } else {
      res.errput('该服务项目已存在')
    }
  }).catch(findErr => seqError(findErr, res))
}