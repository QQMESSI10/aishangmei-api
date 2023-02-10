const path = require('path')
const bcryptjs = require('bcryptjs')
const bcrypt = require('bcryptjs')

const utils = require('../utils/utils')

const Admin = require('../db/model/admin')

/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 注册页面
exports.registerPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../router/page/register.html'))
}
// 注册
exports.register = (req, res) => {
  Admin.count().then(count => {
    if (count > 0) {
      res.end('已存在管理账号，注册失败，请联系管理员处理！')
    } else {
      const account = req.body.account
      const password = bcryptjs.hashSync(req.body.password)
      Admin.create({
        account,
        password
      }).then(createRes => {
        res.end('注册成功！')
      }).catch(createErr => utils.seqError(createErr, res))
    }
  }).catch(err => utils.seqError(err, res))
}

// 登录请求的处理函数
exports.login = (req, res) => {
  console.log(req)
  res.send('login OK')
}