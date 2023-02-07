const path = require('path')
const bcryptjs = require('bcryptjs')
const bcrypt = require('bcryptjs')

const db = require('../db/index.js')

/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 注册页面
exports.registerPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../page/register.html'))
}
exports.register = (req, res) => {
  const account = req.body.account
  const password = bcryptjs.hashSync(req.body.password)
  res.header("Content-Type", "application/json; charset=utf-8")
  const selSQL = 'select * from admin'
  db.query(selSQL, (selErr, selRes) => {
    if (selErr) {
      console.log(selErr)
      throw new Error(`sql语句错误:${selSQL}`)
    }
    if (selRes.length > 0) {
      res.end('已存在管理账号，注册失败，请联系管理员处理！')
    } else {
      const insSql = `insert into admin values('${account}','${password}')`
      db.query(insSql, (insErr, insRes) => {
        if (insErr) {
          console.log(insErr)
          throw new Error(`sql语句错误:${insSql}`)
        }
        console.log(insRes)
      })
      res.end('注册成功')
    }
  })
}

// 登录请求的处理函数
exports.login = (req, res) => {
  console.log(req)
  res.send('login OK')
}