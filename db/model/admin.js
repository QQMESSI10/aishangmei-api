const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Admin = sequelize.define('admin', {
  // 在这里定义模型属性
  account: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // 这是其他模型参数
});

module.exports = Admin