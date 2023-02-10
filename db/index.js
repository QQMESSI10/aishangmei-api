// // 导入 mysql 模块
// const mysql = require('mysql')

// // 创建数据库连接对象
// const db = mysql.createPool({
//   host: '59.110.218.237',
//   user: 'root',
//   password: 'b675b7c86d787eca',
//   database: 'aitestdb',
// })

// db.getConnection((err, connection) => {
//   console.log('连接数据库成功')
// })

// // 向外共享 db 数据库连接对象
// module.exports = db

// sequelize连接mysql
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('aitestdb', 'root', 'b675b7c86d787eca', {
  host: '59.110.218.237',
  dialect: 'mysql',
  define: {
    freezeTableName: true
  },
  logging: (...msg) => {
    console.log(msg[0])
    console.log(msg[1].bind)
  },
  timezone: '+08:00'
});


async function tryConnect() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}
tryConnect()

module.exports = sequelize