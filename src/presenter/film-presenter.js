import { remove, replace } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';

export default class FilmPresenter {
  constructor(container, changeData, closeAllPopups) {
    this._closeAllPopups = closeAllPopups;
    this._container = container;
    this.changeData = changeData;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscapeKeydown = this._onEscapeKeydown.bind(this);
  }

  init(filmData) {
    this._film = filmData;
    const oldFilmCard = this._filmCardComponent;
    this._filmCardComponent = new FilmCardView(filmData);
    this._filmCardComponent.setClickHandler(this._clickHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._clickFavoriteHandler);
    this._filmCardComponent.setWatchlistClickHandler(this._clickWatchlistHandler);
    this._filmCardComponent.setWatchedClickHandler(this._clickWatchedHandler);
    this._filmCardComponent.setWatchedClickHandler(this._clickWatchedHandler);

    if (oldFilmCard === null) {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filmCardComponent, oldFilmCard);
    remove(oldFilmCard);
  }

  _onEscapeKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._closePopup();
    }
    document.body.removeEventListener('keydown', this._onEscapeKeydown);
  }

  _renderPopup(filmData) {
    this._filmPopupComponent = new FilmPopupView(filmData);
    this._filmPopupComponent.setCloseButtonClickHandler(this._closePopup);
    document.body.addEventListener('keydown', this._onEscapeKeydown);
    document.body.classList.add('hide-overflow');
    document.body.appendChild(this._filmPopupComponent.getElement());
  }

  _closePopup() {
    const updatedFilm = this._filmPopupComponent.getUpdatedFilm();
    remove(this._filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    this.changeData(updatedFilm);
  }

  _clickHandler() {
    this._closeAllPopups();
    this._renderPopup(this._film);
  }

  _clickFavoriteHandler() {
    this.changeData(
      Object.assign({}, this._film, {
        userDetails: {
          isWatched: this._film.userDetails.isWatched,
          isFavorite: !this._film.userDetails.isFavorite,
          isInWatchlist: this._film.userDetails.isInWatchlist,
        },
      }),
    );
  }

  _clickWatchlistHandler() {
    this.changeData(
      Object.assign({}, this._film, {
        userDetails: {
          isWatched: this._film.userDetails.isWatched,
          isFavorite: this._film.userDetails.isFavorite,
          isInWatchlist: !this._film.userDetails.isInWatchlist,
        },
      }),
    );
  }

  _clickWatchedHandler() {
    this.changeData(
      Object.assign({}, this._film, {
        userDetails: {
          isWatched: !this._film.userDetails.isWatched,
          isFavorite: this._film.userDetails.isFavorite,
          isInWatchlist: this._film.userDetails.isInWatchlist,
        },
      }),
    );
  }
}
