import MainPresenter from './presenter/main-presenter.js';
import Movies from './model/movies.js';
import SiteMenu from './model/site-menu.js';
import Comments from './model/comments.js';
import Api from './api.js';

const AUTHORIZATION_KEY = 'Basic dfGpeSfgkQUGdfS';
const SERVER_ADRESS = 'https://15.ecmascript.pages.academy/cinemaddict';

const api = new Api(AUTHORIZATION_KEY, SERVER_ADRESS);

const filmsModel = new Movies();
const filterModel = new SiteMenu();
const commentModel = new Comments();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const mainPresenter = new MainPresenter(mainElement, headerElement, filmsModel, filterModel, commentModel, api);
mainPresenter.init();
