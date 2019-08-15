const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const mail = require('./mail')

const app = express()
const port = config.port
const webhookUrl = config.webhookUrl

app.use(bodyParser.json())

app.post(webhookUrl, async (req, res) => {
  console.log('Webhook post triggered')
  console.log(`Request body: ${req.body}`)

  try {
    await mail.send(req.body)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
    return
  }

  res.sendStatus(200)
})

app.listen(port, () => console.log(`Ghost notifier listening on port ${port}!`))
