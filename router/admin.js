const express = require('express')
const path = require('path')
const router = express.Router()

// 导入用户路由处理函数模块
const adminHandler = require('../router_handler/admin')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/admin')


// 注册
router.get('/registerPage', adminHandler.registerPage)
router.post('/register', adminHandler.register)

// 登录
// 3. 在用户登录的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误
router.post('/login', expressJoi(reg_login_schema), adminHandler.login)

module.exports = router