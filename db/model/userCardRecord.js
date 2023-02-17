const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const UserCardRecord = sequelize.define('userCardRecord', {
  // 在这里定义模型属性
  userCardId: {
    type: DataTypes.INTEGER,
  },
  type: {    // 0消费，1充值
    type: DataTypes.INTEGER,
  },
  consumeId: {
    type: DataTypes.INTEGER,
  },
  rechargeId: {
    type: DataTypes.INTEGER,
  },
  money: {
    type: DataTypes.FLOAT,
  },
  balance: {
    type: DataTypes.FLOAT,
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  // 这是其他模型参数
});

module.exports = UserCardRecord