import axios from 'axios'

const PROXY_URL = 'https://allorigins.hexlet.app/get'

const fetchRSS = (url) => {
  const params = new URLSearchParams({
    url,
    disableCache: 'true',
  })

  const fullUrl = `${PROXY_URL}?${params.toString()}`

  return axios.get(fullUrl)
    .then((response) => {
      if (!response.data.contents) {
        throw new Error('network')
      }
      return response.data.contents
    })
    .catch(() => {
      throw new Error('network')
    })
}

export default fetchRSS
