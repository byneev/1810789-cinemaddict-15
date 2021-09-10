import dayjs from 'dayjs';
import AbstractElement from './abstract-element.js';

const getFilmDetails = (film) => {
  const { description, poster, title, ageRating, originalTitle, rating, producer, writers, actors, realiseDate, runtime, country, genres, userDetails } = film;
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
      <div class="film-details__poster">
      <img class="film-details__poster-img" src="${poster}" alt="${title}">
      <p class="film-details__age">${ageRating}+</p>
    </div>
    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${title}</h3>
          <p class="film-details__title-original">Original: ${originalTitle}</p>
        </div>
        <div class="film-details__rating">
          <p class="film-details__total-rating">${rating}</p>
        </div>
      </div>
      <table class="film-details__table">
      <tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${producer}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${writers.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${actors.join(', ')}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Release Date</td>
        <td class="film-details__cell">${realiseDate !== null ? dayjs(realiseDate).format('DD MMMM YYYY') : ''}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Runtime</td>
        <td class="film-details__cell">${runtime}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">Country</td>
        <td class="film-details__cell">${country}</td>
      </tr>
      <tr class="film-details__row">
        <td class="film-details__term">${genres.length === 1 ? 'Genre' : 'Genres'}</td>
        <td class="film-details__cell">
        ${genres.map((element) => `<span class="film-details__genre">${element}</span>`).join('')}
          </td>
      </tr>
    </table>
    <p class="film-details__film-description">
    ${description}
    </p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="film-details__control-button
        ${userDetails.isInWatchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button
        ${userDetails.isWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button
        ${userDetails.isFavorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDetails extends AbstractElement {
  constructor(film) {
    super();
    this._film = film;
    this._clickCloseButtonHandler = this._clickCloseButtonHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickInWatchlistHandler = this._clickInWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
  }

  _clickWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _clickInWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _clickCloseButtonHandler(evt) {
    evt.preventDefault();
    this._callback.clickClose();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._clickFavoriteHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._clickWatchedHandler);
  }

  setInWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._clickInWatchlistHandler);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.clickClose = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickCloseButtonHandler);
  }

  getTemplate() {
    return getFilmDetails(this._film);
  }
}
