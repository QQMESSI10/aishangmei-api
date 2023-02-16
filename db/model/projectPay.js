const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const ProjectPay = sequelize.define('projectPay', {
  consumeProjectId: DataTypes.INTEGER,
  userCardId: DataTypes.INTEGER,
  money: DataTypes.FLOAT
})

module.exports = ProjectPay