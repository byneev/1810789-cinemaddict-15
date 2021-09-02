import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import { generateFilm } from './mock/film-mock.js';
import FilmsAmountView from './view/films-amount.js';
import { render, RenderPosition } from './utils/render.js';
import { getCountByFilters } from './utils/common.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import Movies from './model/movies.js';
import SiteMenu from './model/site-menu.js';

const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}
const filmsModel = new Movies();
filmsModel.setFilms(films);
const filterModel = new SiteMenu();
const filmsCountByFilters = getCountByFilters(films);
filterModel.setFilters(filmsCountByFilters);

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

const siteMenuComponent = new SiteMenuView(films);
render(mainElement, siteMenuComponent, RenderPosition.BEFOREEND);
render(headerElement, new ProfileView(films), RenderPosition.BEFOREEND);
render(mainElement, new SortView(), RenderPosition.BEFOREEND);

const filmListPresenter = new FilmListPresenter(mainElement, siteMenuComponent, filmsModel, filterModel);
filmListPresenter.init(films);

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmsAmountView(films), RenderPosition.BEFOREEND);
