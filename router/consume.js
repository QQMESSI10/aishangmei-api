const express = require('express')
const router = express.Router()

const consumeHandler = require('../router_handler/consume')

router.post('/add', consumeHandler.add)

router.post('/list', consumeHandler.list)

module.exports = router