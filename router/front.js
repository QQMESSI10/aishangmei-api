const express = require("express");
const path = require("path");
const router = express.Router();

// 导入用户路由处理函数模块
const frontHandler = require("../router_handler/front");

router.post("/error", frontHandler.error);

module.exports = router;
