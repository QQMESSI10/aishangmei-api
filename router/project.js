const express = require('express')
const router = express.Router()

const projectHandler = require('../router_handler/project')

router.post('/list', projectHandler.list)

module.exports = router