exports.seqError = (err, res) => {
  console.log(err)
  res.end('未知错误异常，注册失败，请联系管理员处理！')
}