// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: '59.110.218.237',
  user: 'root',
  password: 'b675b7c86d787eca',
  database: 'aitestdb',
})

db.getConnection((err, connection) => {
  console.log('连接数据库成功')
})

// 向外共享 db 数据库连接对象
module.exports = db