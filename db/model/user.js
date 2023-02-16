const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const User = sequelize.define('user', {
  // 在这里定义模型属性
  name: {
    type: DataTypes.STRING(50),
  },
  telephone: {
    type: DataTypes.STRING(11),
  },
  birthday: {
    type: DataTypes.DATEONLY,
  }
}, {
  // 这是其他模型参数
});

module.exports = User