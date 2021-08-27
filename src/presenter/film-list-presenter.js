import { remove, updateArray } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import FilmListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import MoreButtonView from '../view/more-button.js';
import FilmPresenter from './film-presenter.js';

const MAX_FILMS_COUNT = 5;

export default class FilmListPresenter {
  constructor(container, siteMenuComponent) {
    this._siteMenuComponent = siteMenuComponent;
    this._beginPoint = MAX_FILMS_COUNT;
    this._filmPresenters = new Map();
    this._container = container;
    this._moreButtonComponent = null;
    this._filmsListComponent = new FilmsListView();
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._closeAllPopups = this._closeAllPopups.bind(this);
    this._clickMoreButtonHandler = this._clickMoreButtonHandler.bind(this);
    this._renderFilms = this._renderFilms.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector('.films-list__container');
    render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsList();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateArray(this._films, updatedFilm);
    const currentFilmPresenter = this._filmPresenters.get(updatedFilm.id);
    currentFilmPresenter.init(updatedFilm);
  }

  _closeAllPopups() {
    this._filmPresenters.forEach((value) => {
      if (value._isOpen) {
        value._closePopup();
      }
    });
  }

  _renderFilm(film) {
    this._filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleFilmChange, this._closeAllPopups);
    this._filmPresenter.init(film);
    this._filmPresenters.set(film.id, this._filmPresenter);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(film));
  }

  _renderLoadMoreButton() {
    render(this._filmsListContainer, this._moreButtonComponent, RenderPosition.AFTER);
  }

  _renderFilmsList() {
    if (this._moreButtonComponent !== null) {
      remove(this._moreButtonComponent);
    }
    this._moreButtonComponent = new MoreButtonView();
    if (this._films.length === 0) {
      const siteMenuActiveItemHref = this._siteMenuComponent.getElement().querySelector('.main-navigation__item--active').getAttribute('href');
      render(this._filmsListContainer, new FilmListEmptyView(siteMenuActiveItemHref), RenderPosition.BEFOREEND);
      return;
    }
    this._renderFilms(0, Math.min(this._films.length, MAX_FILMS_COUNT));
    if (this._films.length > MAX_FILMS_COUNT) {
      this._renderLoadMoreButton();
    }
    this._moreButtonComponent.setClickHandler(this._clickMoreButtonHandler);
  }

  _clickMoreButtonHandler() {
    this._renderFilms(this._beginPoint, this._beginPoint + MAX_FILMS_COUNT);
    this._beginPoint += MAX_FILMS_COUNT;
    if (this._beginPoint >= this._films.length) {
      remove(this._moreButtonComponent);
    }
  }
}
