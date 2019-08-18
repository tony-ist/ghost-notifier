const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const mail = require('./mail')
const telegram = require('./telegram')

const app = express()
const port = config.port
const webhookUrl = config.webhookUrl

app.use(bodyParser.json())

app.post(`/${webhookUrl}`, async (request, response) => {
  console.log('Webhook post triggered')
  console.log(`Request body: ${JSON.stringify(request.body, null, 2)}`)

  try {
    await mail.send(request.body)
    await telegram.send(request.body)
  } catch (error) {
    console.error(error)
    response.sendStatus(500)
    return
  }

  response.sendStatus(200)
})

app.listen(port, () => console.log(`Ghost notifier listening on port ${port}!`))
