const { logger, seqError } = require("../utils/utils");
const { Op } = require("sequelize");

const Card = require("../db/model/card");
const UserCard = require("../db/model/userCard");
const Recharge = require("../db/model/recharge");
const UserProject = require("../db/model/userProject");

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
  let userCardId = "";
  UserCard.findOne({ where: { userId: user, cardId: card } })
    .then(async (findRes) => {
      let ucHandle = null;
      if (findRes === null) {
        ucHandle = await UserCard.create({
          userId: user,
          cardId: card,
          balance: money,
        });
        userCardId = ucHandle.id;
      } else {
        userCardId = findRes.id;
        const balance = findRes.balance + Number(money);
        ucHandle = await UserCard.update(
          { balance },
          {
            where: {
              id: findRes.id,
            },
          }
        );
      }
      Recharge.create({ userCardId, money, serverId, remark, date })
        .then((rechargeRes) => {
          const rechargeId = rechargeRes.id;
          const promise = projectData.map((m) => {
            if (m) {
              return UserProject.create({
                userId: user,
                projectId: m,
                rechargeId,
              });
            } else {
              return false;
            }
          });
          Promise.all(promise)
            .then((upResArr) => {
              res.okput("添加成功");
            })
            .catch((promiseErr) => seqError(promiseErr, res));
        })
        .catch((rechargeErr) => seqError(rechargeErr, res));
    })
    .catch((findErr) => seqError(findErr, res));
};
