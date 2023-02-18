const { logger, seqError } = require("../utils/utils");
const { Op } = require("sequelize");

const Card = require("../db/model/card");
const UserCard = require("../db/model/userCard");
const Recharge = require("../db/model/recharge");
const RechargeProject = require("../db/model/rechargeProject");
const UserCardRecord = require("../db/model/userCardRecord");
const Server = require("../db/model/server");
const User = require("../db/model/user");

require("../db/relevancy");

exports.list = (req, res) => {
  Card.findAndCountAll({
    where: {
      name: {
        [Op.like]: `%${req.body.name || ""}%`,
      },
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
  const { user, card, money, serverId, remark, date, projectData } = req.body;
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
        date,
      })
        .then((rechargeRes) => {
          const rechargeId = rechargeRes.id;
          const rechargeProject = projectData.map((m) => {
            if (m) {
              return RechargeProject.create({
                userId: user,
                projectId: m,
                rechargeId,
              });
            } else {
              return false;
            }
          });
          const balance = userCardInfo.balance + Number(money);
          const userCard = UserCard.update(
            { balance },
            { where: { id: userCardInfo.id } }
          );
          const userCardRecord = UserCardRecord.create({
            userCardId: userCardInfo.id,
            type: 1,
            rechargeId,
            money,
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
  let serverList = null;
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
  if (req.body.server) {
    await Server.findAll({
      where: {
        name: {
          [Op.like]: `%${req.body.server || ""}%`,
        },
      },
    }).then((serRes) => {
      if (serRes.length > 0) {
        serverList = serRes.map((m) => {
          return m.id;
        });
      } else {
        isEmpty = true;
      }
    });
  }
  if (!isEmpty) {
    let where = {};
    if (req.body.date) {
      // moment(this.getDataValue("date")).format("YYYY-MM-DD HH:mm:ss");
      const beginDate = new Date(req.body.date + ' 00:00:00')
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
    if (serverList) {
      where.serverId = {
        [Op.in]: serverList,
      };
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
