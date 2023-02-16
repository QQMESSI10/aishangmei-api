const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Consume = sequelize.define('consume', {
  userId: DataTypes.INTEGER,
  serverId: DataTypes.INTEGER,
  remark: DataTypes.STRING,
  date: DataTypes.DATE,
})

module.exports = Consume