const handleProcessState = (state, elements, i18n) => {
  const { input, submitButton, feedback } = elements

  switch (state.form.state) {
    case 'filling':
      submitButton.disabled = false
      break

    case 'sending':
      submitButton.disabled = true
      feedback.textContent = ''
      break

    case 'success':
      submitButton.disabled = false
      input.value = ''
      input.focus()
      feedback.textContent = i18n.t('success')
      feedback.classList.remove('text-danger')
      feedback.classList.add('text-success')
      input.classList.remove('is-invalid')
      break

    case 'error':
      submitButton.disabled = false
      feedback.textContent = i18n.t(`errors.${state.form.error}`)
      feedback.classList.remove('text-success')
      feedback.classList.add('text-danger')
      break

    default:
      throw new Error(`Unknown state: ${state.form.state}`)
  }
}

const handleError = (state, elements) => {
  const { input } = elements

  if (state.form.error) {
    input.classList.add('is-invalid')
  }
  else {
    input.classList.remove('is-invalid')
  }
}

const renderFeeds = (state, elements, i18n) => {
  const { feedsContainer } = elements

  if (state.feeds.length === 0) {
    feedsContainer.innerHTML = ''
    return
  }

  const feedsHtml = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('feedsTitle')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${state.feeds.map(feed => `
          <li class="list-group-item border-0 border-end-0">
            <h3 class="h6 m-0">${feed.title}</h3>
            <p class="m-0 small text-black-50">${feed.description}</p>
          </li>
        `).join('')}
      </ul>
    </div>
  `

  feedsContainer.innerHTML = feedsHtml
}

const renderPosts = (state, elements, i18n) => {
  const { postsContainer } = elements

  if (state.posts.length === 0) {
    postsContainer.innerHTML = ''
    return
  }

  const postsHtml = `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('postsTitle')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${state.posts.map((post) => {
          const isViewed = state.uiState.viewedPostIds.has(post.id)
          const linkClass = isViewed ? 'fw-normal link-secondary' : 'fw-bold'

          return `
            <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
              <a href="${post.link}" 
                 class="${linkClass}" 
                 data-id="${post.id}" 
                 target="_blank" 
                 rel="noopener noreferrer">
                ${post.title}
              </a>
              <button type="button" 
                      class="btn btn-outline-primary btn-sm" 
                      data-id="${post.id}" 
                      data-bs-toggle="modal" 
                      data-bs-target="#modal">
                ${i18n.t('viewButton')}
              </button>
            </li>
          `
        }).join('')}
      </ul>
    </div>
  `

  postsContainer.innerHTML = postsHtml
}

const renderModal = (state, elements) => {
  const { modal } = elements
  const { modalPostId } = state.uiState

  if (!modalPostId) {
    return
  }

  const post = state.posts.find(p => p.id === modalPostId)
  if (!post) {
    return
  }

  modal.title.textContent = post.title
  modal.body.textContent = post.description
  modal.link.href = post.link
}

const render = (state, elements, i18n) => (path) => {
  switch (path) {
    case 'form.state':
      handleProcessState(state, elements, i18n)
      break

    case 'form.error':
      handleError(state, elements)
      break

    case 'feeds':
      renderFeeds(state, elements, i18n)
      break

    case 'posts':
      renderPosts(state, elements, i18n)
      break

    case 'uiState.viewedPostIds':
      renderPosts(state, elements, i18n)
      break

    case 'uiState.modalPostId':
      renderModal(state, elements)
      break

    default:
      break
  }
}

export default render
