const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const moment = require('moment')

const Recharge = sequelize.define('recharge', {
  userCardId: DataTypes.INTEGER,
  money: DataTypes.FLOAT,
  serverId: DataTypes.INTEGER,
  remark: DataTypes.STRING,
  date: {
    type: DataTypes.DATE,
    get() {
      return moment(this.getDataValue('date')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
})

module.exports = Recharge