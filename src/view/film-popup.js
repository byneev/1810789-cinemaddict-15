import dayjs from 'dayjs';
import AbstractElement from './abstract-element.js';

const getDetailsGenres = (genres) => genres.map((element) => `<span class="film-details__genre">${element}</span>`).join('');

const getDetailsInfo = (film) => {
  const { poster, title, ageRating, originalTitle, rating } = film;
  return `<div class="film-details__poster">
          <img class="film-details__poster-img" src=".${poster}" alt="${title}">
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
          </div>`;
};

const getDetailsTable = (film) => {
  const { producer, writers, actors, realiseDate, runtime, country, genres } = film;
  return `<table class="film-details__table">
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
              ${getDetailsGenres(genres)}
                </td>
            </tr>
          </table>`;
};

const getDetailsDescription = (film) => {
  const { description } = film;
  return `<p class="film-details__film-description">
            ${description}
          </p>`;
};

const getDetailsControl = (film) => {
  const { userDetails } = film;
  return `<section class="film-details__controls">
        <button type="button" class="film-details__control-button
        ${
          userDetails.isInWatchlist ? 'film-details__control-button--active' : ''
        } film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button
        ${
          userDetails.isWatched ? 'film-details__control-button--active' : ''
        } film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button
        ${
          userDetails.isFavorite ? 'film-details__control-button--active' : ''
        } film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>`;
};

const getDetailsTitle = (film) => {
  const { commentsList } = film;
  return `<h3 class='film-details__comments-title'>
      Comments <span class='film-details__comments-count'>${commentsList.length}</span>
    </h3>`;
};

const formatDateByOld = (date) => {
  let result = dayjs(date).format('YYYY/MM/DD hh:mm');
  const nowDate = dayjs().toDate();
  const dateGapInDays = (nowDate - date) * 86400000;
  if (dateGapInDays < 5) {
    result = `${Math.floor(dateGapInDays)} days ago`;
  }
  return result;
};

const getComment = (comment) => {
  const { author, message, date, emotion } = comment;
  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src=".${emotion}" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${message}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date !== null ? formatDateByOld(date) : ''}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

const getDetailsComments = (film) => {
  const { commentsList } = film;
  return `<ul class="film-details__comments-list">
  ${commentsList.map((comment) => getComment(comment)).join('')}
</ul>`;
};

const getFilmPopup = (film) => `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
          ${getDetailsInfo(film)}
          ${getDetailsTable(film)}
          ${getDetailsDescription(film)}
        </div>
      </div>
      ${getDetailsControl(film)}
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
      ${getDetailsTitle(film)}
      ${getDetailsComments(film)}
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;

export default class FilmPopup extends AbstractElement {
  constructor(film) {
    super();
    this._film = film;
    this._clickCloseButtonHandler = this._clickCloseButtonHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
  }

  _clickCloseButtonHandler(evt) {
    evt.preventDefault();
    this._callback.clickClose();
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.clickFavorite();
  }

  _clickWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatchlist();
  }

  _clickWatchedHandler(evt) {
    evt.preventDefault();
    this._callback.clickWatched();
  }

  setClickCloseButtonHandler(callback) {
    this._callback.clickClose = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickCloseButtonHandler);
  }

  setClickFavoriteHandler(callback) {
    this._callback.clickFavorite = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._clickFavoriteHandler);
  }

  setClickWatchlistHandler(callback) {
    this._callback.clickFavorite = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._clickWatchlistHandler);
  }

  setClickWatchedHandler(callback) {
    this._callback.clickFavorite = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._clickWatchedHandler);
  }

  getTemplate() {
    return getFilmPopup(this._film);
  }
}
