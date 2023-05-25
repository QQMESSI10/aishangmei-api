const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Server = sequelize.define('server', {
  // 在这里定义模型属性
  code: {
    type: DataTypes.STRING(4),
  },
  name: {
    type: DataTypes.STRING(50),
  },
  telephone: {
    type: DataTypes.STRING(11),
  },
}, {
  // 这是其他模型参数
});

module.exports = Server