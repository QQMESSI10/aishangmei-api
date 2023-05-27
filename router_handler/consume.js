const { logger, seqError } = require('../utils/utils')
const { Op } = require("sequelize");

const Consume = require("../db/model/consume")
const ConsumeProject = require("../db/model/consumeProject")
const ProjectPay = require("../db/model/projectPay")
const UserCard = require("../db/model/userCard")
const UserCardRecord = require("../db/model/userCardRecord")
const User = require("../db/model/user")
const Project = require("../db/model/project")
const Server = require("../db/model/server");
const RechargeProject = require('../db/model/rechargeProject');

exports.add = (req, res) => {
  const { user, remark, date, project } = req.body
  Consume.create({
    userId: user,
    remark,
    date
  }).then(consume => {
    const consumeId = consume.id
    let promiseArr = project.map(async (m) => {
      const projectInsert = await ConsumeProject.create({
        consumeId,
        projectId: m.project,
        serverId: m.server,
        money: m.money
      }).then(async (cp) => {
        const consumeProjectId = cp.id
        let payPromise = m.payArr.map(async (pm) => {
          let promiseList = []
          let userCardId = null
          if (pm.pay.cardType == 5) {
            userCardId = Number(pm.pay.id.split(';')[0])
          } else {
            userCardId = pm.pay.id
          }
          // 项目支付表
          const ppCreate = ProjectPay.create({
            consumeProjectId,
            type: pm.pay.cardType,
            userCardId,
            money: pm.money
          })
          promiseList.push(ppCreate)
          return Promise.all(promiseList).catch((ucErr) => seqError(ucErr, res))
        })
        return Promise.all(payPromise)
      })
      return Promise.all(projectInsert)
    })
    async function balanceUpdate() {
      for(let i=0; i<project.length; i++) {
        for(let j=0; j<project[i].payArr.length; j++) {
          let userCardId = null
          let pm = project[i].payArr[j]
          if (pm.pay.cardType == 5) {
            userCardId = Number(pm.pay.id.split(';')[0])
          } else {
            userCardId = pm.pay.id
          }
          if (pm.pay.cardType == 5) {
            await RechargeProject.findOne({where: {id: userCardId}}).then(async rpFind => {
              await RechargeProject.update({consumeId}, {where: {id: userCardId}})
            })
          } else if (userCardId != 0) {
            await UserCard.findOne({where: {id: userCardId}}).then(async ucFind => {
              let money = pm.realMoney || pm.money || 1
              let balance = ucFind.balance - money
              await UserCard.update({balance}, {where: {id: userCardId}})
              await UserCardRecord.create({
                userCardId,
                type: 0,
                consumeId,
                money: pm.realMoney || pm.money || 1,
                balance,
                date
              })
            })
          }
        }
      } 
    }
    Promise.all(promiseArr).then(async (successArr) => {
      await balanceUpdate()
      res.okput(consumeId);
    }).catch((promiseErr) => seqError(promiseErr, res))
  }).catch((consumeErr) => seqError(consumeErr, res))
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
            include: [Project, Server]
          })
          promiseArr.push(consumeProject)
          await Promise.all(promiseArr).then(proRes => {
            proRes.forEach(pro => {
              pro.forEach(project => {
                e.project.push({
                  money: project.money,
                  name: project.project.name,
                  server: project.server.name
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

exports.consumeOne = (req, res) => {
  const consumeInfo = Consume.findOne({where: {id: req.body.id}, include: [User]})
  const projectInfo = new Promise(async (resolve, reject) => {
    await ConsumeProject.findAll({where: {consumeId: req.body.id}, include: [Project]}).then(async cp => {
      for(let i=0; i<cp.length; i++)
      await ProjectPay.findAll({where: {consumeProjectId: cp[i].id}}).then(pp => {
        cp[i].payArr = pp
      })
      const projectData = cp.map(cpm => {
        return {
          consumeProjectId: cpm.id,
          project: cpm.projectId,
          money: cpm.money,
          server: cpm.serverId,
          payArr: cpm.payArr.map(m => {
            return {
              payId: m.type == 5 ? m.userCardId+';' : m.userCardId,
              money: m.money,
              type: m.type
            }
          })
        }
      })
      resolve(projectData)
    })
  })
  Promise.all([consumeInfo, projectInfo]).then(findArr => {
    let resData = {
      info: {
        id: findArr[0].id,
        user: findArr[0].userId,
        date: findArr[0].date,
        telephone: findArr[0].user.telephone,
        remark: findArr[0].remark,
      },
      projectArr: findArr[1]
    }
    res.okput(resData);
  }).catch((findErr) => seqError(findErr, res))
}

exports.edit = (req, res) => {
  const { id, remark, date, project } = req.body 
  let promiseArr = []
  promiseArr.push(Consume.update({date, remark}, {where: {id}}))
  project.forEach(e => {
    promiseArr.push(ConsumeProject.update({serverId: e.serverId}, {where: {id: e.consumeProjectId}}))
  })
  Promise.all(promiseArr).then(() => {
    res.okput("修改成功");
  }).catch((updaErr) => seqError(updaErr, res));
}