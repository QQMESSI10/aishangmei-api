require('./model/admin')
require('./model/server')
require('./model/user')
require('./model/project')
require('./model/card')
require('./model/consume')
require('./model/recharge')
require('./model/userCard')
require('./model/consumeProject')
require('./model/projectPay')
require('./model/userProject')

const sequelize = require('./index')

sequelize.sync({ alter: true }).then(() => {
  console.log('数据库同步成功')
}).catch((err) => {
  console.log('数据库同步失败！！！')
  console.log(err)
})