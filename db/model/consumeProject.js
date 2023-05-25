const { DataTypes } = require('sequelize');
const sequelize = require('../index');
// 消费项目表
const ConsumeProject = sequelize.define('consumeProject', {
  consumeId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  serverId: DataTypes.INTEGER,
  money: DataTypes.FLOAT
})

module.exports = ConsumeProject