const jwt = require('jsonwebtoken')
const axios = require('axios')
const url = require('url')
const config = require('./config')

const [id, secret] = config.adminApiKey.split(':')

const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
  keyid: id,
  algorithm: 'HS256',
  expiresIn: '5m',
  audience: `/v2/admin/`
})

async function getSubscribers() {
  const ghostUrl = url.resolve(config.baseUrl, 'ghost/api/v2/admin/subscribers/')
  const headers = { Authorization: `Ghost ${token}` }
  const response = await axios.get(ghostUrl, { headers })

  return response.data.subscribers
}

async function start() {
  const subscribers = await getSubscribers()
  console.log(subscribers)
}

start().catch(console.error)
