const { logger, seqError } = require("../utils/utils");
const { Op } = require("sequelize");
const moment = require('moment')

const Card = require("../db/model/card");
const UserCard = require("../db/model/userCard");
const Recharge = require("../db/model/recharge");
const RechargeProject = require("../db/model/rechargeProject");
const UserCardRecord = require("../db/model/userCardRecord");
const Server = require("../db/model/server");
const User = require("../db/model/user");
const Project = require("../db/model/project")

require("../db/relevancy");

exports.list = (req, res) => {
  let nowDate = moment(new Date()).format('YYYY-MM-DD')
  Card.findAndCountAll({
    where: {
      name: {
        [Op.like]: `%${req.body.name || ""}%`,
      },
      beginDate: {
        [Op.lte]: nowDate
      },
      endDate: {
        [Op.gte]: nowDate
      }
    },
    offset: req.body.offset,
    limit: req.body.limit,
    order: [[req.body.orderBy || "createdAt", "DESC"]],
  })
    .then((findRes) => {
      res.okput({ total: findRes.count, list: findRes.rows });
    })
    .catch((findErr) => seqError(findErr, res));
};

exports.recharge = (req, res) => {
  const { user, card, money, serverId, remark, date, projectData, realMoney } = req.body;
  UserCard.findOne({ where: { userId: user, cardId: card } })
    .then(async (finducRes) => {
      let userCardInfo = null;
      if (finducRes === null) {
        userCardInfo = await UserCard.create({
          userId: user,
          cardId: card,
          balance: 0,
        });
      } else {
        userCardInfo = finducRes;
      }
      Recharge.create({
        userCardId: userCardInfo.id,
        money,
        serverId,
        remark,
        realMoney,
        date,
      })
        .then((rechargeRes) => {
          const rechargeId = rechargeRes.id;
          const rechargeProject = projectData.map((m) => {
            if (m) {
              return RechargeProject.create({
                userId: user,
                projectId: m.projectId,
                rechargeId,
                expiryDate: m.expiryDate
              });
            } else {
              return false;
            }
          });
          const balance = userCardInfo.balance + Number(realMoney);
          const userCard = UserCard.update(
            { balance },
            { where: { id: userCardInfo.id } }
          );
          const userCardRecord = UserCardRecord.create({
            userCardId: userCardInfo.id,
            type: 1,
            rechargeId,
            money: realMoney,
            balance,
            date,
          });
          Promise.all(rechargeProject, userCard, userCardRecord)
            .then((upResArr) => {
              res.okput(rechargeId);
            })
            .catch((promiseErr) => seqError(promiseErr, res));
        })
        .catch((rechargeErr) => seqError(rechargeErr, res));
    })
    .catch((findErr) => seqError(findErr, res));
};

exports.rechargeList = async (req, res) => {
  let userCardList = null;
  let isEmpty = false;
  if (req.body.name || req.body.telephone) {
    await User.findAll({
      where: {
        name: {
          [Op.like]: `%${req.body.name || ""}%`,
        },
        telephone: {
          [Op.like]: `%${req.body.telephone || ""}%`,
        },
      },
    })
      .then(async (userRes) => {
        if (userRes.length > 0) {
          const userList = userRes.map((m) => {
            return m.id;
          });
          await UserCard.findAll({
            where: {
              userId: {
                [Op.in]: userList,
              },
            },
          })
            .then((ucRes) => {
              if (ucRes.length > 0) {
                userCardList = ucRes.map((m) => {
                  return m.id;
                });
              } else {
                isEmpty = true;
              }
            })
            .catch((ucErr) => seqError(ucErr, res));
        } else {
          isEmpty = true;
        }
      })
      .catch((userErr) => seqError(userErr, res));
  }
  if (!isEmpty) {
    let where = {};
    if (req.body.date) {
      const beginDate = new Date(req.body.date + " 00:00:00");
      const endDate = new Date(req.body.date + " 23:59:59");
      where.date = {
        [Op.between]: [beginDate, endDate],
      };
    }
    if (userCardList) {
      where.userCardId = {
        [Op.in]: userCardList,
      };
    }
    if (req.body.server) {
      where.serverId = req.body.server;
    }
    Recharge.findAndCountAll({
      where,
      offset: req.body.offset,
      limit: req.body.limit,
      order: [[req.body.orderBy || "createdAt", "DESC"]],
      include: [
        {
          model: UserCard,
          include: [User, Card],
        },
        Server,
      ],
    })
      .then((findRes) => {
        const list = findRes.rows.map((m) => {
          const { id, date, money } = m;
          return {
            id,
            date,
            money,
            user: m.userCard.user.name,
            telephone: m.userCard.user.telephone,
            card: m.userCard.card.name,
            server: m.server.name,
          };
        });
        res.okput({ total: findRes.count, list });
      })
      .catch((findErr) => seqError(findErr, res));
  } else {
    res.okput({ total: 0, list: [] });
  }
};

exports.rechargeOne = (req, res) => {
  const projectArr = RechargeProject.findAll({
    where: { rechargeId: req.body.id },
  });
  const recharge = Recharge.findOne({
    where: {
      id: req.body.id,
    },
    include: [{ model: UserCard, include: User }],
  });
  Promise.all([projectArr, recharge])
    .then((resData) => {
      const projectData = resData[0].map((m) => {
        return {
          projectId: m.projectId,
          expiryDate: m.expiryDate
        };
      });
      const { id, date, money, remark, serverId } = resData[1];
      const user = resData[1].userCard.userId;
      const card = resData[1].userCard.cardId;
      const telephone = resData[1].userCard.user.telephone;
      res.okput({
        id,
        date,
        user,
        card,
        money,
        remark,
        serverId,
        projectData,
        telephone,
      });
    })
    .catch((err) => seqError(err));
};

exports.rechargeEdit = (req, res) => {
  const { id, serverId, remark, date } = req.body;
  if (id) {
    Recharge.update(
      { serverId, remark, date },
      {
        where: { id },
      }
    )
      .then(() => {
        res.okput("修改成功");
      })
      .catch((updaErr) => seqError(updaErr, res));
  } else {
    res.errput("未知错误，请联系管理员处理");
  }
}

exports.userCard = (req, res) => {
  const { userId } = req.body
  const consumeId = req.body.consumeId || null
  let list = []
  const rechargeProject = RechargeProject.findAll({
    where: { 
      userId,
      consumeId
    },
    include: [Project]
  })
  const userCard = UserCard.findAll({
    where: { userId },
    order: [["balance", "DESC"]],
    include: [{ model: Card }]
  })
  Promise.all([rechargeProject, userCard]).then(resArr => {
    list = resArr[0].map(m => {
      return {
        id: m.id+';',
        cardType: 5,
        projectId: m.projectId,
        name: '赠送的' + m.project.name,
        expiryDate: m.expiryDate
      }
    })
    const validData = resArr[1].filter(f => f.balance > 0)
    list = list.concat(validData.map(m => {
      return {
        id: m.id,
        name: m.card.name,
        params: JSON.parse(m.card.params),
        cardType: m.card.type,
        balance: m.balance,
        expiryDate: m.expiryDate
      }
    }))
    res.okput(list)
  }).catch(resErr => seqError(resErr, res))
}


exports.add = (req, res) => {
  Card.findOne({
    where: {
      name: req.body.name
    }
  }).then(findRes => {
    if (findRes === null) {
      Card.create({
        name: req.body.name,
        discount: req.body.discount
      }).then(creaRes => {
        const { createdAt, updatedAt, ...info } = creaRes.dataValues
        res.okput(info)
      }).catch(creaErr => seqError(creaErr, res))
    } else {
      res.errput('该卡名已存在')
    }
  }).catch(findErr => seqError(findErr, res))
}

exports.userCardAdd = (req, res) => {
  UserCard.findOne({
    where: {
      userId: req.body.user,
      cardId: req.body.cardId
    }
  }).then(findRes => {
    if (findRes === null) {
      UserCard.create({
        userId: req.body.user,
        cardId: req.body.cardId,
        balance: req.body.balance
      }).then(creaRes => {
        const { createdAt, updatedAt, ...info } = creaRes.dataValues
        res.okput(info)
      }).catch(creaErr => seqError(creaErr, res))
    } else {
      res.errput('该会员已存在该卡')
    }
  }).catch(findErr => seqError(findErr, res))
}