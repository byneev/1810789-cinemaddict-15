import MainPresenter from './presenter/main-presenter.js';
import Movies from './model/movies.js';
import SiteMenu from './model/site-menu.js';
import Comments from './model/comments.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION_KEY = 'Basic lfGpeRfgkUSFdfS';
const SERVER_ADRESS = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(AUTHORIZATION_KEY, SERVER_ADRESS);
const store = new Store(STORE_NAME, window.localStorage);
const provider = new Provider(api, store);

const filmsModel = new Movies();
const filterModel = new SiteMenu();
const commentModel = new Comments();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const mainPresenter = new MainPresenter(mainElement, headerElement, filmsModel, filterModel, commentModel, api, provider);
mainPresenter.init();

window.addEventListener('load', () => {
  window.navigator.serviceWorker.register('/sw.js');
});
