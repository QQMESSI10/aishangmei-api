/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const bcrypt = require('bcryptjs')

// 登录请求的处理函数
exports.login = (req, res) => {
  console.log(req)
  res.send('login OK')
}