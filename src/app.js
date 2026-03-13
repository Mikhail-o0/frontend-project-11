import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import onChange from 'on-change'
import i18next from 'i18next'
import resources from './locales/index.js'
import render from './view.js'
import createRSSController from './controller.js'

const app = () => {
  const i18nInstance = i18next.createInstance()

  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    const state = {
      form: {
        state: 'filling',
        error: null,
        valid: true,
      },
      feeds: [],
      posts: [],
      uiState: {
        viewedPostIds: new Set(),
        modalPostId: null,
      },
    }

    const elements = {
      form: document.querySelector('.rss-form'),
      input: document.querySelector('#url-input'),
      submitButton: document.querySelector('button[type="submit"]'),
      feedback: document.querySelector('.feedback'),
      feedsContainer: document.querySelector('.feeds'),
      postsContainer: document.querySelector('.posts'),
      modal: {
        element: document.querySelector('#modal'),
        title: document.querySelector('.modal-title'),
        body: document.querySelector('.modal-body'),
        link: document.querySelector('.full-article'),
      },
    }

    const watchedState = onChange(state, render(state, elements, i18nInstance))

    const rssController = createRSSController(state, watchedState, i18nInstance)

    elements.form.addEventListener('submit', e => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      rssController.processRSS(url)
    })

    elements.input.addEventListener('input', () => {
      if (!state.form.valid || state.form.error) {
        watchedState.form.valid = true
        watchedState.form.error = null
      }
    })

    elements.postsContainer.addEventListener('click', e => {
      const postId = e.target.dataset.id
      if (!postId) {
        return
      }

      if (e.target.tagName === 'BUTTON') {
        watchedState.uiState.modalPostId = postId

        if (!state.uiState.viewedPostIds.has(postId)) {
          watchedState.uiState.viewedPostIds.add(postId)
        }
      }

      if (e.target.tagName === 'A') {
        if (!state.uiState.viewedPostIds.has(postId)) {
          watchedState.uiState.viewedPostIds.add(postId)
        }
      }
    })

    elements.modal.element.addEventListener('hidden.bs.modal', () => {
      watchedState.uiState.modalPostId = null
    })
  })
}

export default app
