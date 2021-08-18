import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import FilmsListView from './view/films-list.js';
import MoreButtonView from './view/more-button.js';
import { generateFilm } from './mock/film-mock.js';
import FilmsAmountView from './view/films-amount.js';
import FilmListEmptyView from './view/films-list-empty.js';
import { render, RenderPosition, renderPopup } from './utils/render.js';
import FilmCardView from './view/film-card.js';
import FilmPopupView from './view/film-popup.js';

const renderFilm = (filmList, film) => {
  const filmCard = new FilmCardView(film);
  const filmPopup = new FilmPopupView(film);
  render(filmList, filmCard, RenderPosition.BEFOREEND);
  filmCard.setClickHandler(() => {
    renderPopup(filmPopup);
  });
};

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
  const filmListContainer = mainElement.querySelector('.films-list__container');
  const MAX_FILM_COUNT = 5;
  for (let i = 0; i < Math.min(films.length, MAX_FILM_COUNT); i++) {
    renderFilm(filmListContainer, films[i]);
  }
  const moreButton = new MoreButtonView();
  if (films.length > MAX_FILM_COUNT) {
    render(filmListContainer, moreButton, RenderPosition.AFTER);
  }
  let beginPoint = MAX_FILM_COUNT;
  moreButton.setClickHandler(() => {
    films.slice(beginPoint, beginPoint + MAX_FILM_COUNT).forEach((film) => renderFilm(filmListContainer, film));
    beginPoint += MAX_FILM_COUNT;
    if (beginPoint >= films.length) {
      moreButton.getElement().remove();
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
