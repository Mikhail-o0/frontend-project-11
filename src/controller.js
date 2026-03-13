import { v4 as uuidv4 } from 'uuid'
import validate from './validation.js'
import fetchRSS from './api.js'
import parseRSS from './parser.js'

const createRSSController = (state, watchedState, i18nInstance) => {
  const checkFeedUpdates = feed => {
    return fetchRSS(feed.url)
      .then(xmlString => parseRSS(xmlString))
      .then(parsedData => {
        const existingPosts = state.posts.filter(post => post.feedId === feed.id)
        const existingLinks = new Set(existingPosts.map(post => post.link))

        const newPosts = parsedData.posts
          .filter(post => !existingLinks.has(post.link))
          .map(post => ({
            id: uuidv4(),
            feedId: feed.id,
            title: post.title,
            description: post.description,
            link: post.link,
          }))

        if (newPosts.length > 0) {
          watchedState.posts.unshift(...newPosts)
        }
      })
      .catch(err => {
        console.error(`Failed to update feed ${feed.url}:`, err)
      })
  }

  const startAutoUpdate = (delay = 5000) => {
    const checkAllFeeds = () => {
      const promises = state.feeds.map(feed => checkFeedUpdates(feed))

      Promise.all(promises)
        .finally(() => {
          setTimeout(checkAllFeeds, delay)
        })
    }

    setTimeout(checkAllFeeds, delay)
  }

  const processRSS = url => {
    const existingUrls = state.feeds.map(feed => feed.url)

    watchedState.form.state = 'sending'
    watchedState.form.error = null

    return validate(url, existingUrls, i18nInstance)
      .then(() => fetchRSS(url))
      .then(xmlString => parseRSS(xmlString))
      .then(parsedData => {
        const feedId = uuidv4()

        const newFeed = {
          id: feedId,
          url,
          title: parsedData.feed.title,
          description: parsedData.feed.description,
        }

        const newPosts = parsedData.posts.map(post => ({
          id: uuidv4(),
          feedId,
          title: post.title,
          description: post.description,
          link: post.link,
        }))

        watchedState.feeds.unshift(newFeed)
        watchedState.posts.unshift(...newPosts)

        watchedState.form.state = 'success'
        watchedState.form.valid = true

        if (state.feeds.length === 1) {
          startAutoUpdate()
        }
      })
      .catch(err => {
        let errorKey
        if (err.name === 'ValidationError') {
          errorKey = err.type
        } else if (err.message === 'parse') {
          errorKey = 'parse'
        } else {
          errorKey = 'network'
        }

        watchedState.form.valid = false
        watchedState.form.error = errorKey
        watchedState.form.state = 'error'
      })
  }

  return {
    processRSS,
    checkFeedUpdates,
    startAutoUpdate,
  }
}

export default createRSSController
