const express = require('express')
const config = require('./config')

const app = express()
const port = config.port

app.post('/webhook', (req, res) => {
  console.log('Post triggered')
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))