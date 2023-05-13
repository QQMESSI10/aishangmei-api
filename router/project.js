const express = require('express')
const router = express.Router()

const projectHandler = require('../router_handler/project')

router.post('/list', projectHandler.list)

router.post('/userProject', projectHandler.userProject)

router.post('/add', projectHandler.add)

module.exports = router