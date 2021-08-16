import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import FilmsListView from './view/films-list.js';
import MoreButtonView from './view/more-button.js';
import { generateFilm } from './mock/film-mock.js';
import FilmsAmountView from './view/films-amount.js';
import FilmListEmptyView from './view/films-list-empty.js';
import { render, RenderPosition, renderFilm } from './utils/render.js';
import FilmCardView from './view/film-card.js';

const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const siteMenuComponent = new SiteMenuView(films);
render(mainElement, siteMenuComponent, RenderPosition.BEFOREEND);
const siteMenuActiveItem = siteMenuComponent.getElement().querySelector('.main-navigation__item--active');
const siteMenuActiveItemHref = siteMenuActiveItem.getAttribute('href');

const renderFilmsBoard = () => {
  render(headerElement, new ProfileView(films), RenderPosition.BEFOREEND);
  render(mainElement, new SortView(), RenderPosition.BEFOREEND);
  const filmsListComponent = new FilmsListView();
  render(mainElement, filmsListComponent, RenderPosition.BEFOREEND);

  const filmsList = mainElement.querySelector('.films-list');
  const filmListElement = filmsList.querySelector('.films-list__container');

  const MAX_FILM_COUNT = 5;
  for (let i = 0; i < Math.min(films.length, MAX_FILM_COUNT); i++) {
    renderFilm(filmListElement, new FilmCardView(films[i]));
  }
  // todo
  if (films.length > MAX_FILM_COUNT) {
    render(filmsList, new MoreButtonView(), RenderPosition.BEFOREEND);
  }
  const moreButton = filmsList.querySelector('.films-list__show-more');
  let beginPoint = MAX_FILM_COUNT;
  moreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films.slice(beginPoint, beginPoint + MAX_FILM_COUNT).forEach((film) => renderFilm(filmListElement, new FilmCardView(film)));
    beginPoint += MAX_FILM_COUNT;
    if (beginPoint >= films.length) {
      moreButton.remove();
    }
  });
};

if (films.length === 0) {
  render(mainElement, new FilmListEmptyView(siteMenuActiveItemHref), RenderPosition.BEFOREEND);
} else {
  renderFilmsBoard();
}

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmsAmountView(films), RenderPosition.BEFOREEND);
