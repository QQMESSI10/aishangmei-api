const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Admin = sequelize.define('admin', {
  // 在这里定义模型属性
  account: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING(11)
  }
}, {
  // 这是其他模型参数
});

module.exports = Admin