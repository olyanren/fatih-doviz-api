const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  let values=require('./dynamodb-stream-api')
  values.handler()
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})