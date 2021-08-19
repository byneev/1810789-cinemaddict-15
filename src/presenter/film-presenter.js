import { remove, replace } from '../utils/common.js';
import { render, renderPopup, RenderPosition } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';

export default class Film {
  constructor(container, changeData) {
    this._container = container;
    this.changeData = changeData;
    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    //some handlers
    this._clickHandler = this._clickHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
  }

  initCard(filmData) {
    this._film = filmData;
    const oldFilmCard = this._filmCardComponent;
    this._filmCardComponent = new FilmCardView(filmData);
    this._filmPopupComponent = new FilmPopupView(filmData);
    // навешиваем листенеры
    this._filmCardComponent.setClickHandler(this._clickHandler);
    //TODO
    //реализовать эти сеттеры хэндлеров во View filmCard и filmPopup
    //хэндлеры должны менять данные и в попапе и в карточке
    this._filmCardComponent.setClickFavoriteHandler(this._clickFavoriteHandler);
    this._filmCardComponent.setClickWatchlistHandler(this._clickWatchlistHandler);
    this._filmCardComponent.setClickWatchedHandler(this._clickWatchedHandler);
    this._filmPopupComponent.setClickFavoriteHandler(this._clickFavoriteHandler);
    this._filmPopupComponent.setClickWatchlistHandler(this._clickWatchlistHandler);
    this._filmPopupComponent.setClickWatchedHandler(this._clickWatchedHandler);
    if (this.oldFilmCard === null) {
      render(this.container, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filmCardComponent, oldFilmCard);
    remove(oldFilmCard);
  }

  _clickHandler() {
    // TODO
    // реализовать setClickBtnHandler в popupView
    // создать функцию по сокрытию попапа
    // передать в этот презентер из лист-презентера колбэк по закрытию всех попапов (реализовать в лист-презентере)
    // вызвать этот колбэк перед renderPopup
    //
    renderPopup(this._filmPopupComponent);
  }
  //TODO
  //реализовать changeData в лист-презенторе:
  // - изменить массив фильмов
  // - отрисовать что изменилось - filmCard и filmPopup

  _clickFavoriteHandler() {
    this.changeData(
      Object.assign({}, this._film.userDetails, {
        isFavorite: !this._film.userDetails.isFavorite,
      })
    );
  }

  _clickWatchlistHandler() {
    this.changeData(
      Object.assign({}, this._film.userDetails, {
        isInWatchlist: !this._film.userDetails.isInWatchlist,
      })
    );
  }

  _clickWatchedHandler() {
    this.changeData(
      Object.assign({}, this._film.userDetails, {
        isWatched: !this._film.userDetails.isWatched,
      })
    );
  }
}
