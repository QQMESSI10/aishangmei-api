const express = require('express')
const router = express.Router()

const cardHandler = require('../router_handler/card')

router.post('/list', cardHandler.list)


router.post("/recharge", cardHandler.recharge);

router.post('/recharge/list', cardHandler.rechargeList)

module.exports = router