const { logger, seqError } = require('../utils/utils')
const { Op } = require("sequelize");

const Consume = require("../db/model/consume")
const ConsumeProject = require("../db/model/consumeProject")
const ProjectPay = require("../db/model/projectPay")
const UserCard = require("../db/model/userCard")
const UserCardRecord = require("../db/model/userCardRecord")
const User = require("../db/model/user")
const Project = require("../db/model/project")
const Server = require("../db/model/server")

exports.add = (req, res) => {
  const { user, server, remark, date, project } = req.body
  Consume.create({
    userId: user,
    serverId: server,
    remark,
    date
  }).then(consume => {
    const consumeId = consume.id
    let promiseArr = []
    project.forEach(e => {
      promiseArr.push(
        ConsumeProject.create({
          consumeId,
          projectId: e.project,
          money: e.money
        }).then(cp => {
          const consumeProjectId = cp.id
          e.payArr.forEach(async pay => {
            await ProjectPay.create({
              consumeProjectId,
              userCardId: pay.payType == -1 ? null : pay.payType,
              money: pay.realMoney,
            }).catch((ppErr) => seqError(ppErr, res));
            if (pay.payType != -1) {
              await UserCard.findOne({where: { id: pay.payType }}).then(async ucFind => {
                const balance = ucFind.balance - pay.realMoney
                await UserCard.update({balance}, {where: {id: pay.payType}}).catch((ucUpErr) => seqError(ucUpErr, res));
                await UserCardRecord.create({
                  userCardId: pay.payType,
                  type: 0,
                  consumeId,
                  money: pay.realMoney,
                  balance,
                  date
                }).catch((ucrErr) => seqError(ucrErr, res));
              }).catch((ucErr) => seqError(ucErr, res));
            }
          })
        }).catch((cpErr) => seqError(cpErr, res))
      )
    })
    Promise.all(promiseArr).then(() => {
      res.okput(consumeId);
    })
  }).catch((consumeErr) => seqError(consumeErr, res));
},

exports.list = async (req, res) => {
  let userList = null;
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
      .then((userRes) => {
        if (userRes.length > 0) {
          userList = userRes.map((m) => {
            return m.id;
          });
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
    if (userList) {
      where.userId = {
        [Op.in]: userList,
      };
    }
    if (req.body.server) {
      where.serverId = req.body.server;
    }
    Consume.findAndCountAll({
      where,
      offset: req.body.offset,
      limit: req.body.limit,
      order: [[req.body.orderBy || "createdAt", "DESC"]],
      include: [
        User,
        Server,
      ]
    }).then(findRes => {
      let proArr = []
      for(let i=0; i<findRes.rows.length; i++) {
        let promiseArr = []
        let func = async function consumeCir() {
          let e = findRes.rows[i]
          e.project = []
          let consumeProject = ConsumeProject.findAll({
            where: {
              consumeId: e.id
            },
            include: [Project]
          })
          promiseArr.push(consumeProject)
          await Promise.all(promiseArr).then(proRes => {
            proRes.forEach(pro => {
              pro.forEach(project => {
                e.project.push({
                  money: project.money,
                  name: project.project.name
                })
              })
            })
          }).catch(proErr => seqError(proErr, res))
        }
        proArr.push(func())
      }
      Promise.all(proArr).then(conRes => {
        const list = findRes.rows.map((m) => {
          const { id, date } = m;
          return {
            id,
            date,
            user: m.user.name,
            telephone: m.user.telephone,
            server: m.server.name,
            project: m.project
          };
        });
        res.okput({ total: findRes.count, list });
      })
    }).catch((findErr) => seqError(findErr, res))
  } else {
    res.okput({ total: 0, list: [] });
  }
}