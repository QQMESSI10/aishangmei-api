// 导入 express 模块
const express = require("express");
// 导入 cors 中间件
const cors = require("cors");
// 连接数据库
require("./db/index");
// 同步数据库
// require("./db/sync");

const { logger } = require("./utils/utils");

// 创建 express 的服务器实例
const app = express();

// 将 cors 注册为全局中间件，允许跨域请求
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "1024mb" }));

// 通用配置
app.use((req, res, next) => {
  logger("info", req.ip + "  " + req.url, "访问路由");
  res.header("Content-Type", "application/json; charset=utf-8");
  res.errput = (err, status = 0, data) => {
    res.send({
      status,
      message: err,
      data,
    });
  };
  res.okput = (data, status = 1) => {
    res.send({
      status,
      data,
    });
  };
  next();
});

// 路由
const adminRouter = require("./router/admin");
const frontRouter = require("./router/front");
const userRouter = require("./router/user")
const cardRouter = require("./router/card")
const projectRouter = require("./router/project")
const serverRouter = require("./router/server")
app.use("/admin", adminRouter);
app.use("/front", frontRouter);
app.use("/user", userRouter);
app.use("/card", cardRouter);
app.use("/project", projectRouter);
app.use("/server", serverRouter);

app.use((req, res, next) => {
  res.status(404).send("not found 404");
});

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8888, function () {
  console.log("接口启动成功，端口号：8888");
});
