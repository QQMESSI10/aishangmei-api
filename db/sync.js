require('./model/admin')

const sequelize = require('./index')

sequelize.sync({ alter: true }).then(() => {
  console.log('数据库同步成功')
}).catch((err) => {
  console.log('数据库同步失败！！！')
  console.log(err)
})