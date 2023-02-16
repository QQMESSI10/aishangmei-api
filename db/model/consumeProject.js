const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const ConsumeProject = sequelize.define('consumeProject', {
  consumeId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  money: DataTypes.FLOAT
})

module.exports = ConsumeProject