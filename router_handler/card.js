const { logger, seqError } = require('../utils/utils')
const { Op } = require("sequelize");

const Card = require('../db/model/card')

exports.list = (req, res) => {
  Card.findAndCountAll({
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