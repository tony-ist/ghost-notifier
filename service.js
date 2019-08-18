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

async function validate(postRequestBody) {
  if (!postRequestBody.current || !postRequestBody.current.uuid || !postRequestBody.current.title) {
    console.error('Malformed POST body.')
    return false
  }

  if (!postRequestBody.current.canonical_url) {
    console.error('No canonical URL for post.')
    return false
  }

  const subscribers = await getSubscribers()

  if (subscribers.length === 0) {
    console.log('No subscribers found.')
    return false
  }

  const posts = await getPosts()

  if (posts.length === 0) {
    console.error('No posts found.')
    return false
  }

  const publishedPost = posts.find(p => p.uuid === postRequestBody.current.uuid)

  if (!publishedPost) {
    console.error(`No post with uuid ${postRequestBody.current.uuid} found.`)
    return false
  }

  if (publishedPost.status !== 'published') {
    console.error(`Error: trying to notify about post with status: ${publishedPost.status}.`)
    return false
  }

  return true
}

module.exports = { getSubscribers, getPosts, validate }
