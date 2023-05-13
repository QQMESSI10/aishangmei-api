const express = require('express')
const router = express.Router()

const cardHandler = require('../router_handler/card')

router.post('/list', cardHandler.list)

router.post("/recharge", cardHandler.recharge);

router.post('/recharge/list', cardHandler.rechargeList)

router.post('/recharge/one', cardHandler.rechargeOne)

router.post('/recharge/edit', cardHandler.rechargeEdit)
// 查询用户所持卡(id, 卡名，折扣, 余额)
router.post('/userCard', cardHandler.userCard)

router.post('/add', cardHandler.add)

router.post('/userCard/add', cardHandler.userCardAdd)

module.exports = router