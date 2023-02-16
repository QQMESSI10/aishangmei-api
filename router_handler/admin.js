const path = require('path')
const bcrypt = require('bcryptjs')

const { logger, seqError } = require('../utils/utils')

const Admin = require('../db/model/admin')

/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 注册页面
exports.registerPage = (req, res) => {
  res.header("Content-Type", "text/html; charset=utf-8")
  res.sendFile(path.join(__dirname, '../router/page/register.html'))
}
// 注册
exports.register = (req, res) => {
  Admin.count().then(count => {
    if (count > 0) {
      res.end('已存在管理账号，无法进行注册，请联系管理员处理！')
    } else {
      const account = req.body.account
      const password = bcrypt.hashSync(req.body.password)
      Admin.create({
        account,
        password
      }).then(createRes => {
        res.end('注册成功！')
      }).catch(createErr => seqError(createErr, res))
    }
  }).catch(err => seqError(err, res))
}

// 登录请求的处理函数
exports.login = (req, res) => {
  Admin.findAll({
    where: {
      account: req.body.account,
    }
  }).then(findRes => {
    if (findRes.length != 1) {
      logger('info', req.body.account, '登录异常')
      res.errput('账号输入错误，请重新输入')
    } else {
      const compareResult = bcrypt.compareSync(
        req.body.password,
        findRes[0].password
      );
      if (compareResult) {
        res.okput('登录成功！')
        logger('info', bcrypt.hashSync(req.body.password), '登录成功')
      } else {
        res.errput('密码输入错误，请重新输入')
        logger('info', bcrypt.hashSync(req.body.password), '登录失败')
      }
    }
  }).catch(findErr => seqError(findErr, res))
}