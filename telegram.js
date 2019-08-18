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

async function send(postRequestBody) {
  // TODO: Extract these checks to controller
  if (!postRequestBody.current || !postRequestBody.current.title) {
    console.error('Malformed POST body.')
    return
  }

  if (!postRequestBody.current.canonical_url) {
    console.error('No canonical URL for post.')
    return
  }

  const { title, canonical_url } = postRequestBody.current

  const response = await axiosClient
    .post(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
      chat_id: config.telegramChatId,
      text: `New post: ${title}.\nLink: ${canonical_url}`
    })

  if (response.error) {
    console.error(`Failed to send telegram message: ${JSON.stringify(response.error, null, 2)}`)
  } else {
    console.log(`Successfully sent telegram message: ${JSON.stringify(response.data, null, 2)}`)
  }
}

module.exports = { send }

