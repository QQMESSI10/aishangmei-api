const { DataTypes } = require("sequelize");
const sequelize = require("../index");
// 充值赠送项目表
const RechargeProject = sequelize.define(
  "rechargeProject",
  {
    // 在这里定义模型属性
    userId: {
      type: DataTypes.INTEGER,
    },
    projectId: {
      type: DataTypes.INTEGER,
    },
    rechargeId: {
      type: DataTypes.INTEGER,
    },
    consumeId: {
      type: DataTypes.INTEGER,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
    }
  },
  {
    // 这是其他模型参数
  }
);

module.exports = RechargeProject;
