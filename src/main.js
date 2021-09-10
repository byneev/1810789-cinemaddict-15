import { generateFilm } from './mock/film-mock.js';
import FilmsAmountView from './view/films-amount.js';
import { render, RenderPosition } from './utils/render.js';

import MainPresenter from './presenter/main-presenter.js';
import Movies from './model/movies.js';
import SiteMenu from './model/site-menu.js';
import Comments from './model/comments.js';

const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}
const filmsModel = new Movies();
filmsModel.setFilms(films);
const filterModel = new SiteMenu();
const commentModel = new Comments();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const mainPresenter = new MainPresenter(mainElement, headerElement, filmsModel, filterModel, commentModel);
mainPresenter.init();

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmsAmountView(films), RenderPosition.BEFOREEND);
