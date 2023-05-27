const express = require('express')
const router = express.Router()

const consumeHandler = require('../router_handler/consume')

router.post('/add', consumeHandler.add)

router.post('/list', consumeHandler.list)

// 消费详情
router.post('/consumeOne', consumeHandler.consumeOne)

// 修改
router.post('/edit', consumeHandler.edit)

module.exports = router