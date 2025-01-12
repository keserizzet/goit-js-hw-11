import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.js';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_KEY = '48180440-b38c1b4d4768984d9404c0701';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

// Form gönderildiğinde çalışacak işlev
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search term!' });
    return;
  }

  // Yükleme göstergesini aç
  loader.classList.remove('hidden');
  gallery.innerHTML = ''; // Önceki sonuçları temizle

  try {
    // API isteği
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });

    const images = response.data.hits;

    if (images.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    // Galeriye görselleri ekle
    const markup = images
      .map(
        (img) => `
        <a href="${img.largeImageURL}" class="gallery-item" target="_blank">
          <img src="${img.webformatURL}" alt="${img.tags}" />
        </a>
        <div class="info">
          <p><strong>Tags:</strong> ${img.tags}</p>
          <p><strong>Likes:</strong> ${img.likes}</p>
          <p><strong>Views:</strong> ${img.views}</p>
          <p><strong>Comments:</strong> ${img.comments}</p>
          <p><strong>Downloads:</strong> ${img.downloads}</p>
        </div>`
      )
      .join('');

    gallery.innerHTML = markup;
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong!' });
  } finally {
    // Yükleme göstergesini kapat
    loader.classList.add('hidden');
  }
});
document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector('#counter'));
