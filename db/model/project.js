const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Project = sequelize.define('project', {
  // 在这里定义模型属性
  name: {
    type: DataTypes.STRING,
  },
  remark: {
    type: DataTypes.STRING,
  },
}, {
  // 这是其他模型参数
});

module.exports = Project