const jwt = require('jsonwebtoken')
const axios = require('axios')
const url = require('url')
const nodemailer = require('nodemailer')
const config = require('./config')

const [id, secret] = config.adminApiKey.split(':')

const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
  keyid: id,
  algorithm: 'HS256',
  expiresIn: '5m',
  audience: `/v2/admin/`
})

const headers = { Authorization: `Ghost ${token}` }

async function getSubscribers() {
  const ghostUrl = url.resolve(config.baseUrl, 'ghost/api/v2/admin/subscribers/')
  const response = await axios.get(ghostUrl, { headers })

  return response.data.subscribers
}

async function getPosts() {
  const ghostUrl = url.resolve(config.baseUrl, 'ghost/api/v2/admin/posts/')
  const response = await axios.get(ghostUrl, { headers })

  return response.data.posts
}

async function sendMail(recipient, post){
  const transporter = nodemailer.createTransport({
    host: config.mailHost,
    port: 465,
    secure: true,
    auth: {
      user: config.mailUser,
      pass: config.mailPassword
    }
  })

  const info = await transporter.sendMail({
    from: `"Programming and Stuff 👻" <${config.mailUser}>`,
    to: recipient,
    subject: `New post: ${post.title}`,
    text: `New post in ReFruity's "Programming and Stuff" blog: ${post.canonical_url}`
  })

  console.log(`Message sent to ${recipient}: ${info.messageId}`)
}

async function send() {
  const subscribers = await getSubscribers()

  if (subscribers.length === 0) {
    console.log('No subscribers found.')
    return
  }

  const posts = await getPosts()

  posts.sort((p1, p2) => new Date(p2.published_at) - new Date(p1.published_at))

  if (posts.length === 0) {
    console.log('No posts found.')
    return
  }

  const latestPublishedPost = posts[0]

  for (let subscriber of subscribers) {
    await sendMail(subscriber.email, latestPublishedPost)
  }
}

module.exports = { send }
