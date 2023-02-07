// 导入 express 模块 
const express = require('express')
// 导入 cors 中间件 
const cors = require('cors')

const db = require('./db/index.js')

// 创建 express 的服务器实例 
const app = express()

// 将 cors 注册为全局中间件，允许跨域请求 
app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.use(express.json({limit:'1024mb'}));

// 集中错误抛出
app.use((req, res, next) => {
  res.output = (err, status = 1, data) => {
    if (err)
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
      data
    })
  }
  next()
})


const adminRouter = require('./router/admin')
app.use('/admin', adminRouter)

// 错误处理
const errorHandler = require('./error_handler/error')
app.use(errorHandler)

// 调用 app.listen 方法，指定端口号并启动web服务器 
app.listen(8888, function () {
  console.log('接口启动成功，端口号：8888')
})