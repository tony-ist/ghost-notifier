const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config')
const mail = require('./mail')
const telegram = require('./telegram')
const service = require('./service')

const app = express()
const port = config.port
const webhookUrl = config.webhookUrl

app.use(bodyParser.json())

app.post(`/${webhookUrl}`, async (request, response) => {
  console.log('Webhook post triggered')
  console.log(`Request body: ${JSON.stringify(request.body, null, 2)}`)

  const validationResult = await service.validate(request.body.post)

  if (!validationResult) {
    // TODO: Maybe sleep for random amount of seconds to prevent brute force attacks?
    response.sendStatus(200)
    return
  }

  console.log('Post validation successful')

  const publishedPost = request.body.post.current

  try {
    await mail.send(publishedPost)
    await telegram.send(publishedPost)
  } catch (error) {
    console.error(error)
    response.sendStatus(500)
    return
  }

  response.sendStatus(200)
})

app.listen(port, () => console.log(`Ghost notifier listening on port ${port}!`))
