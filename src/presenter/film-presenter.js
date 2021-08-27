import { remove, replace } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';

export default class Film {
  constructor(container, changeData, closeAllPopups) {
    this._closeAllPopups = closeAllPopups;
    this._isOpen = false;
    this._container = container;
    this.changeData = changeData;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(filmData) {
    this._film = filmData;
    const oldFilmCard = this._filmCardComponent;
    this._filmCardComponent = new FilmCardView(filmData);
    this._filmCardComponent.setClickHandler(this._clickHandler);
    this._filmCardComponent.setClickFavoriteHandler(this._clickFavoriteHandler);
    this._filmCardComponent.setClickWatchlistHandler(this._clickWatchlistHandler);
    this._filmCardComponent.setClickWatchedHandler(this._clickWatchedHandler);

    if (oldFilmCard === null) {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filmCardComponent, oldFilmCard);
    remove(oldFilmCard);
  }

  _renderPopup(filmData) {
    this._filmPopupComponent = new FilmPopupView(filmData);
    this._filmPopupComponent.setClickFavoriteHandler(this._clickFavoriteHandler);
    this._filmPopupComponent.setClickWatchlistHandler(this._clickWatchlistHandler);
    this._filmPopupComponent.setClickWatchedHandler(this._clickWatchedHandler);
    const onEscapeKeydown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        this._closePopup();
      }
      document.body.removeEventListener('keydown', onEscapeKeydown);
    };
    this._filmPopupComponent.setClickCloseButtonHandler(this._closePopup);
    document.body.addEventListener('keydown', onEscapeKeydown);
    document.body.classList.add('hide-overflow');
    document.body.appendChild(this._filmPopupComponent.getElement());
    this._isOpen = true;
    this._currentPopup = this._filmPopupComponent.getElement();
  }

  _closePopup() {
    remove(this._filmPopupComponent);
    document.body.classList.remove('hide-overflow');
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
