import { remove, updateArray } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import FilmListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import MoreButtonView from '../view/more-button.js';
import FilmPresenter from './film-presenter.js';

export default class FilmList {
  constructor(container, activeMenuItem) {
    this._activeMenuItem = activeMenuItem;
    this.MAX_FILMS_COUNT = 5;
    this._beginPoint = this.MAX_FILMS_COUNT;
    this._filmPresenters = new Map();
    this._container = container;
    this._moreButtonComponent = new MoreButtonView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListEmptyComponent = new FilmListEmptyView();
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._closeAllPopups = this._closeAllPopups.bind(this);
    this._clickMoreButtonHandler = this._clickMoreButtonHandler.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector('.films-list__container');
    render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsList();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateArray(this._films, updateArray);
    console.log(this._filmPresenters);
    this._filmPresenters.get(updatedFilm.id).init(updatedFilm);
  }

  _closeAllPopups() {
    this._filmPresenters.forEach((value) => {
      if (value.isOpen) {
        value.closePopup();
        console.log(value);
      }
    });
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleFilmChange, this._closeAllPopups);
    filmPresenter.init(film);
    this._filmPresenters.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(film));
  }

  _renderLoadMoreButton() {
    render(this._filmsListContainer, this._moreButtonComponent, RenderPosition.AFTER);
  }

  _renderFilmsList() {
    if (this._films.length === 0) {
      render(this._filmsListContainer, this._filmsListEmptyComponent(this._films_activeMenuItem), RenderPosition.BEFOREEND);
      return;
    }
    this._renderFilms(0, Math.min(this._films.length, this.MAX_FILMS_COUNT));
    if (this._films.length > this.MAX_FILMS_COUNT) {
      this._renderLoadMoreButton();
    }
    this._moreButtonComponent.setClickHandler(this._clickMoreButtonHandler);
  }

  _clickMoreButtonHandler() {
    this._renderFilms(this._beginPoint, this._beginPoint + this.MAX_FILMS_COUNT).this._beginPoint += this.MAX_FILMS_COUNT;
    if (this._beginPoint > this._films.length) {
      remove(this._moreButtonComponent);
    }
  }
}
