const nodemailer = require('nodemailer')
const config = require('./config')
const service = require('./service')

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

  const text = `
    New post in ReFruity's "Programming and Stuff" blog: ${post.canonical_url ?? post.url}
    <small>To unsubscribe, reply to this email with "unsubscribe".</small>
  `

  // TODO: Extract mail template
  const info = await transporter.sendMail({
    from: `"Programming and Stuff 👻" <${config.mailUser}>`,
    to: recipient,
    subject: `New post: ${post.title}`,
    text
  })

  console.log(`Message sent to ${recipient}: ${info.messageId}.`)
}

async function send(publishedPost) {
  const subscribers = await service.getSubscribers()

  console.log(subscribers)

  for (let subscriber of subscribers) {
    if (subscriber.subscribed === true) {
      await sendMail(subscriber.email, publishedPost)
    }
  }
}

module.exports = { send }
