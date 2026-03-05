import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import i18next from 'i18next';
import { v4 as uuidv4 } from 'uuid';
import validate from './validation.js';
import fetchRSS from './api.js';
import parseRSS from './parser.js';
import resources from './locales/index.js';
import render from './view.js';

const app = () => {
  const i18nInstance = i18next.createInstance();
  
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    const state = {
      form: {
        state: 'filling', // filling, sending, success, error
        error: null,
        valid: true,
      },
      feeds: [],
      posts: [],
      uiState: {
        viewedPostIds: new Set(),
        modalPostId: null,
      },
    };

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
    };

    const watchedState = onChange(state, render(state, elements, i18nInstance));

    const processRSS = (url) => {
  const existingUrls = state.feeds.map((feed) => feed.url);
  
  watchedState.form.state = 'sending';
  watchedState.form.error = null;
  
  return validate(url, existingUrls, i18nInstance)
    .then(() => fetchRSS(url))
    .then((xmlString) => parseRSS(xmlString))
    .then((parsedData) => {
      const feedId = uuidv4();
      
      const newFeed = {
        id: feedId,
        url,
        title: parsedData.feed.title,
        description: parsedData.feed.description,
      };
      
      const newPosts = parsedData.posts.map((post) => ({
        id: uuidv4(),
        feedId,
        ...post,
      }));
      
      watchedState.feeds.unshift(newFeed);
      watchedState.posts.unshift(...newPosts);
      
      watchedState.form.state = 'success';
      watchedState.form.valid = true;
    })
    .catch((err) => {
      let errorKey;
      if (err.name === 'ValidationError') {
        errorKey = err.type; // 'required', 'url', 'notOneOf'
      } else if (err.message === 'parse') {
        errorKey = 'parse';
      } else {
        errorKey = 'network';
      }
      
      watchedState.form.valid = false;
      watchedState.form.error = errorKey;
      watchedState.form.state = 'error';
    });
};

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();
      
      processRSS(url);
    });

    elements.input.addEventListener('input', () => {
      if (!state.form.valid || state.form.error) {
        watchedState.form.valid = true;
        watchedState.form.error = null;
      }
    });
  });
};

export default app;