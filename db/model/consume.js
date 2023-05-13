const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const moment = require('moment')

const Consume = sequelize.define('consume', {
  userId: DataTypes.INTEGER,
  serverId: DataTypes.INTEGER,
  remark: DataTypes.STRING,
  date: {
    type: DataTypes.DATE,
    get() {
      return moment(this.getDataValue('date')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
})

module.exports = Consume