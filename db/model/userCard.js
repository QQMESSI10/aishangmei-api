const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const UserCard = sequelize.define('userCard', {
  // 在这里定义模型属性
  userId: {
    type: DataTypes.INTEGER,
  },
  cardId: {
    type: DataTypes.INTEGER,
  },
  balance: {
    type: DataTypes.FLOAT,
  },
}, {
  // 这是其他模型参数
});

module.exports = UserCard