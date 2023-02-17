const { DataTypes } = require("sequelize");
const sequelize = require("../index");

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
    }
  },
  {
    // 这是其他模型参数
  }
);

module.exports = RechargeProject;
