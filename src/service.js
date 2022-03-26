const jwt = require('jsonwebtoken')
const axios = require('axios')
const url = require('url')
const config = require('./config')

const [id, secret] = config.adminApiKey.split(':')

const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
  keyid: id,
  algorithm: 'HS256',
  expiresIn: '5m',
  audience: '/v3/admin/'
})

const headers = { Authorization: `Ghost ${token}` }

async function getSubscribers() {
  const ghostUrl = url.resolve(config.ghostBaseUrl, 'ghost/api/v3/admin/members/')
  const response = await axios.get(ghostUrl, { headers })

  return response.data.members
}

async function getPosts() {
  const ghostUrl = url.resolve(config.ghostBaseUrl, 'ghost/api/v3/admin/posts/')
  const response = await axios.get(ghostUrl, { headers })

  return response.data.posts
}

async function validate(postRequestBody) {
  if (!postRequestBody?.current?.title) {
    console.error('Malformed POST body.')
    return false
  }

  let url = postRequestBody.current.canonical_url

  if (!url) {
    console.error('No canonical URL for post. Using standard URL.')
    url = postRequestBody.current.url;
  }

  console.log('Getting ghost subscribers list...')

  let subscribers = []

  try {
    subscribers = await getSubscribers()
  } catch(error) {
    console.log('Error getting ghost subscribers!')
    console.error(error)
    return false
  }

  if (subscribers.length === 0) {
    console.log('No subscribers found.')
    return false
  }

  console.log(`Successfully found ${subscribers.length} subscribers.`)

  console.log('Getting ghost posts list...')

  let posts = []

  try {
    posts = await getPosts()
  } catch(error) {
    console.log('Error getting ghost posts!')
    console.error(error)
    return false
  }

  console.log(`Successfully fetched ${posts.length} posts from ghost!`)

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
