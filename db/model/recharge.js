const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Recharge = sequelize.define('recharge', {
  userCardId: DataTypes.INTEGER,
  money: DataTypes.FLOAT,
  serverId: DataTypes.INTEGER,
  remark: DataTypes.STRING,
  date: DataTypes.DATE,
})

module.exports = Recharge