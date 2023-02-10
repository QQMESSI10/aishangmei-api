const express = require('express')
const path = require('path')
const router = express.Router()

// 导入用户路由处理函数模块
const adminHandler = require('../router_handler/admin')

// 注册
router.get('/registerPage', adminHandler.registerPage)
router.post('/register', adminHandler.register)

// 登录
router.post('/login', adminHandler.login)

module.exports = router