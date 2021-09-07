import { generateFilm } from './mock/film-mock.js';
import FilmsAmountView from './view/films-amount.js';
import { render, RenderPosition } from './utils/render.js';

import MainPresenter from './presenter/main-presenter.js';
import Movies from './model/movies.js';
import SiteMenu from './model/site-menu.js';
import Comments from './model/comments.js';
import Api from './api.js';
import { MethodType } from './constants.js';

const AUTHORIZATION_KEY = 'Basic UpeSfgkQUPytFwz';
const SERVER_ADRESS = 'https://15.ecmascript.pages.academy/cinemaddict/';

const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}

const api = new Api(AUTHORIZATION_KEY, SERVER_ADRESS);

const filmsModel = new Movies();
const filterModel = new SiteMenu();
const commentModel = new Comments();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const mainPresenter = new MainPresenter(mainElement, headerElement, filmsModel, filterModel, commentModel, api);
mainPresenter.init();

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmsAmountView(films), RenderPosition.BEFOREEND);
