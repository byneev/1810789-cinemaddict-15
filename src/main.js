import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import MoreButtonView from './view/more-button.js';
import { generateFilm } from './mock/film-mock.js';
import FilmPopupView from './view/film-popup.js';
import FilmsAmountView from './view/films-amount.js';
import { onCardClickHandler, render, RenderPosition } from './utils.js';
import FilmListEmptyView from './view/films-list-empty.js';

const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const siteMenuElement = new SiteMenuView(films).getElement();
render(mainElement, siteMenuElement, RenderPosition.BEFOREEND);
const siteMenuActiveItem = siteMenuElement.querySelector('.main-navigation__item--active');
const siteMenuActiveItemHref = siteMenuActiveItem.getAttribute('href');

const renderPopup = (film, element) => {
  const filmPopupElement = new FilmPopupView(film).getElement();

  const closePopup = () => {
    document.body.removeChild(filmPopupElement);
    document.body.classList.remove('hide-overflow');
  };
  onCardClickHandler(film, filmPopupElement, '.film-details__close-btn', closePopup);

  const onEscapeHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closePopup();
    }
    evt.target.removeEventListener(evt.key, onEscapeHandler);
  };

  document.body.addEventListener('keydown', (evt) => onEscapeHandler(evt));
  document.body.classList.add('hide-overflow');
  document.body.appendChild(filmPopupElement);
  element.removeEventListener('click', renderPopup);
};

const renderFilm = (filmList, film) => {
  const filmCardElement = new FilmCardView(film).getElement();

  onCardClickHandler(film, filmCardElement, '.film-card__title', renderPopup);
  onCardClickHandler(film, filmCardElement, '.film-card__poster', renderPopup);
  onCardClickHandler(film, filmCardElement, '.film-card__comments', renderPopup);
  render(filmList, filmCardElement, RenderPosition.BEFOREEND);
};

const renderFilmsBoard = () => {
  render(headerElement, new ProfileView(films).getElement(), RenderPosition.BEFOREEND);
  render(mainElement, new SortView().getElement(), RenderPosition.BEFOREEND);
  const filmsListElement = new FilmsListView();
  render(mainElement, filmsListElement.getElement(), RenderPosition.BEFOREEND);

  const filmsList = mainElement.querySelector('.films-list');
  const filmListElement = filmsList.querySelector('.films-list__container');

  const MAX_FILM_COUNT = 5;
  for (let i = 0; i < Math.min(films.length, MAX_FILM_COUNT); i++) {
    renderFilm(filmListElement, films[i]);
  }

  if (films.length > MAX_FILM_COUNT) {
    render(filmsList, new MoreButtonView().getElement(), RenderPosition.BEFOREEND);
  }
  const moreButton = filmsList.querySelector('.films-list__show-more');
  let beginPoint = MAX_FILM_COUNT;
  moreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films.slice(beginPoint, beginPoint + MAX_FILM_COUNT).forEach((film) => renderFilm(filmListElement, film));
    beginPoint += MAX_FILM_COUNT;
    if (beginPoint >= films.length) {
      moreButton.remove();
    }
  });
};

if (films.length === 0) {
  render(mainElement, new FilmListEmptyView(siteMenuActiveItemHref).getElement(), RenderPosition.BEFOREEND);
} else {
  renderFilmsBoard();
}

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, new FilmsAmountView(films).getElement(), RenderPosition.BEFOREEND);
