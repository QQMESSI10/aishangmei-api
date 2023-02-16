const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Card = sequelize.define('card', {
  // 在这里定义模型属性
  name: {
    type: DataTypes.STRING,
  },
  discount: {
    type: DataTypes.FLOAT
  },
  remark: {
    type: DataTypes.STRING,
  },
  beginDate: {
    type: DataTypes.DATEONLY
  },
  endDate: {
    type: DataTypes.DATEONLY
  }
}, {
  // 这是其他模型参数
});

module.exports = Card