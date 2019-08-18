const axios = require('axios')
const SocksProxyAgent = require('socks-proxy-agent')
const config = require('./config')

let axiosClient = axios.create()

if (process.env.NODE_ENV === 'development') {
  const { proxyHost, proxyPort } = config
  const proxyOptions = `socks5://${proxyHost}:${proxyPort}`
  const httpsAgent = new SocksProxyAgent(proxyOptions)
  axiosClient = axios.create({ httpsAgent })
}

async function send(publishedPost) {
  const { title, canonical_url } = publishedPost

  const response = await axiosClient
    .post(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
      chat_id: config.telegramChatId,
      text: `New post: ${title}.\nLink: ${canonical_url}`
    })

  console.log(`Successfully sent telegram message: ${JSON.stringify(response.data, null, 2)}`)
}

module.exports = { send }

