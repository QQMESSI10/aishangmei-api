const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const User = sequelize.define('user', {
  // 在这里定义模型属性
  name: {
    type: DataTypes.STRING,
  },
  telephone: {
    type: DataTypes.INTEGER(11),
  },
  birthday: {
    type: DataTypes.DATE,
  }
}, {
  // 这是其他模型参数
});

module.exports = User