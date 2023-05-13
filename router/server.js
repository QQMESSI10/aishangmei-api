const express = require('express')
const router = express.Router()

const serverHandler = require('../router_handler/server')

router.post('/list', serverHandler.list)

router.post('/add', serverHandler.add)

module.exports = router