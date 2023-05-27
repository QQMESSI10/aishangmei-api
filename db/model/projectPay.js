const { DataTypes } = require('sequelize');
const sequelize = require('../index');
// 消费项目支付表
const ProjectPay = sequelize.define('projectPay', {
  consumeProjectId: DataTypes.INTEGER,
  userCardId: DataTypes.INTEGER,
  money: DataTypes.FLOAT,
  type: DataTypes.INTEGER,
})

module.exports = ProjectPay