const Card = require('./model/card')
const Consume = require('./model/consume')
const ConsumeProject = require('./model/consumeProject')
const Project = require('./model/project')
const ProjectPay = require('./model/projectPay')
const Recharge = require('./model/recharge')
const Server = require('./model/server')
const User = require('./model/user')
const UserCard = require('./model/userCard')
const RechargeProject = require('./model/rechargeProject')
const UserCardRecord = require('./model/userCardRecord')


// Consume表
User.hasOne(Consume, {
  foreignKey: 'userId'
})
Consume.belongsTo(User)

Server.hasOne(Consume, {
  foreignKey: 'serverId'
})
Consume.belongsTo(Server)

// ConsumeProject表
Consume.hasOne(ConsumeProject, {
  foreignKey: 'consumeId'
})
ConsumeProject.belongsTo(Consume)

Project.hasOne(ConsumeProject, {
  foreignKey: 'projectId'
})
ConsumeProject.belongsTo(Project)

// ProjectPay表
ConsumeProject.hasOne(ProjectPay, {
  foreignKey: 'consumeProjectId'
})
ProjectPay.belongsTo(ConsumeProject)

UserCard.hasOne(ProjectPay, {
  foreignKey: 'userCardId'
})
ProjectPay.belongsTo(UserCard)

// Recharge表
UserCard.hasOne(Recharge, {
  foreignKey: 'userCardId'
})
Recharge.belongsTo(UserCard)

Server.hasOne(Recharge, {
  foreignKey: 'serverId'
})
Recharge.belongsTo(Server)

// UserCard表
User.hasOne(UserCard, {
  foreignKey: 'userId'
})
UserCard.belongsTo(User)

Card.hasOne(UserCard, {
  foreignKey: 'cardId'
})
UserCard.belongsTo(Card)

// RechargeProject表
User.hasOne(RechargeProject, {
  foreignKey: 'userId'
})
RechargeProject.belongsTo(User)

Project.hasOne(RechargeProject, {
  foreignKey: 'projectId'
})
RechargeProject.belongsTo(Project)

Recharge.hasOne(RechargeProject, {
  foreignKey: 'rechargeId'
})
RechargeProject.belongsTo(Recharge)

Consume.hasOne(RechargeProject, {
  foreignKey: 'consumeId'
})
RechargeProject.belongsTo(Consume)

// UserCardRecord表
UserCard.hasOne(UserCardRecord, {
  foreignKey: 'userCardId'
})
UserCardRecord.belongsTo(UserCard)

Consume.hasOne(UserCardRecord, {
  foreignKey: 'consumeId'
})
UserCardRecord.belongsTo(Consume)

Recharge.hasOne(UserCardRecord, {
  foreignKey: 'rechargeId'
})
UserCardRecord.belongsTo(Recharge)