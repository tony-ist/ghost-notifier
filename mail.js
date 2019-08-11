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
  });

  const info = await transporter.sendMail({
    from: `"Programming and stuff 👻" <${config.mailUser}>`,
    to: recipient,
    subject: `New post: ${post.title}`,
    text: `New post in ReFruity's "Programming and stuff" blog: ${post.canonical_url}`
  });

  console.log('Message sent: %s', info.messageId);
}

async function start() {
  const subscribers = await getSubscribers()
  // console.log(subscribers)

  const posts = await getPosts()
  // console.log(posts.map(p => ({ title: p.title, url: p.url, canonicalUrl: p.canonical_url })))

  const post = posts.find(p => p.id === '5d39d901dfe0fa00011ac63b')

  for (let i in subscribers) {
    await sendMail(subscribers[i].email, post)
  }

}

start().catch(console.error)
