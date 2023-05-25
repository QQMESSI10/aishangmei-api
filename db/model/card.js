const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Card = sequelize.define('card', {
  // 在这里定义模型属性
  name: {
    type: DataTypes.STRING,
  },
  remark: {
    type: DataTypes.STRING,
  },
  beginDate: {
    type: DataTypes.DATEONLY
  },
  endDate: {
    type: DataTypes.DATEONLY
  },
  // 1:充值增额卡 2：充值打折卡 3：充值增额打折卡 4：次卡
  type: {
    type: DataTypes.INTEGER,
  },
  // params根据type：
  //      1：[赠送基数，赠送额度],
  //      2：[折扣力度],
  //      3：[赠送基数，赠送额度，折扣力度],
  //      4：[项目id，次数]
  params: {
    type: DataTypes.STRING
  },
  expiryDays: {
    type: DataTypes.INTEGER
  }
}, {
  // 这是其他模型参数
});

module.exports = Card