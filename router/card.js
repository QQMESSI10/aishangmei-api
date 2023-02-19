const express = require('express')
const router = express.Router()

const cardHandler = require('../router_handler/card')

router.post('/list', cardHandler.list)


router.post("/recharge", cardHandler.recharge);

router.post('/recharge/list', cardHandler.rechargeList)

router.post('/recharge/one', cardHandler.rechargeOne)

router.post('/recharge/edit', cardHandler.rechargeEdit)

module.exports = router