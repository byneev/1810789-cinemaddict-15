import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import MoreButtonView from './view/more-button.js';
import { generateFilm } from './mock/film-mock.js';
import FilmPopupView from './view/film-popup.js';
import FilmsAmountView from './view/films-amount.js';
import { render, RenderPosition } from './utils.js';
import StatisticView from './view/statistic.js';

const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
render(mainElement, new SiteMenuView(films).getElement(), RenderPosition.BEFOREEND);
render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
const filmsListElement = new FilmsListView();
render(mainElement, filmsListElement.getElement(), RenderPosition.BEFOREEND);

const filmsList = mainElement.querySelector('.films-list');
const filmListElement = filmsList.querySelector('.films-list__container');

const MAX_FILM_COUNT = 5;

for (let i = 0; i < Math.min(films.length, MAX_FILM_COUNT); i++) {
  render(filmListElement, new FilmCardView(films[i]).getElement(), RenderPosition.BEFOREEND);
}

render(headerElement, new ProfileView(films).getElement());
if (films.length > MAX_FILM_COUNT) {
  render(filmsList, new MoreButtonView().getElement(), RenderPosition.BEFOREEND);
}
const moreButton = filmsList.querySelector('.films-list__show-more');
let beginPoint = MAX_FILM_COUNT;
moreButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  films.slice(beginPoint, beginPoint + MAX_FILM_COUNT).forEach((film) => render(filmListElement, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));
  beginPoint += MAX_FILM_COUNT;
  if (beginPoint >= films.length) {
    moreButton.remove();
  }
});

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmsAmountView(films).getElement(), RenderPosition.BEFOREEND);
// render(mainElement, new FilmPopupView(films[0]).getElement(), RenderPosition.BEFOREEND);
