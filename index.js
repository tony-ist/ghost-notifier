const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const mail = require('./mail')

const app = express()
const port = config.port

app.use(bodyParser)

app.post('/webhook', async (req, res) => {
  console.log(req.body)
  console.log('/webhook post triggered')

  res.send(200)
})

app.listen(port, () => console.log(`Ghost notifier listening on port ${port}!`))
