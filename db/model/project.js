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
  type: {   // 0：打折  1：不打折
    type: DataTypes.INTEGER,
  }
}, {
  // 这是其他模型参数
});

module.exports = Project