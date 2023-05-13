const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 新增会员
router.post('/add', userHandler.add)
// 会员列表
router.post('/list', userHandler.list)
// 会员修改
router.post('/update', userHandler.update)
// 会员持有卡列表
router.post('/card', userHandler.card)

module.exports = router