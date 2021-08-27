import dayjs from 'dayjs';
import Smart from './smart.js';

const EMOJIES = ['smile', 'sleeping', 'puke', 'angry'];

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

const getFilmPopup = (film) => {
  const { description, poster, title, ageRating, originalTitle, rating, producer, writers, actors, realiseDate, runtime, country, genres, commentsList, isInWatchlist, isWatched, isFavorite, emoji } = film;
  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
      <div class="film-details__poster">
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
        ${isInWatchlist ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button
        ${isWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button
        ${isFavorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
      <h3 class='film-details__comments-title'>
      Comments <span class='film-details__comments-count'>${commentsList.length}</span>
    </h3>
    <ul class="film-details__comments-list">
    ${commentsList.map((comment) => getComment(comment)).join('')}
  </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${!emoji ? '' : `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile"></img>`}
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          <div class="film-details__emoji-list">
          ${EMOJIES.map((item) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${item}" value="${item}" ${item === emoji ? 'checked' : ''}>
            <label class="film-details__emoji-label" for="emoji-${item}">
              <img src="./images/emoji/${item}.png" width="30" height="30" alt="emoji">
            </label>`).join('')}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends Smart {
  constructor(film) {
    super();
    this._commentText = null;
    this._data = FilmPopup._parseFilmToData(film);
    this._clickCloseButtonHandler = this._clickCloseButtonHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickInWatchlistHandler = this._clickInWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._clickEmojiHandler = this._clickEmojiHandler.bind(this);
    this._setInnerHandlers();
  }

  updateData(data) {
    super.updateData(data);
    this.getElement().querySelector('.film-details__comment-input').value = this._commentText;
  }

  _clickEmojiHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: evt.target.parentNode.getAttribute('for').split('-')[1],
    });
  }

  _clickWatchedHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatched: !this._data.isWatched,
    });
  }

  _clickInWatchlistHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isInWatchlist: !this._data.isInWatchlist,
    });
  }

  _clickFavoriteHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite,
    });
  }

  _setInnerHandlers() {
    const labels = this.getElement().querySelectorAll('.film-details__emoji-label');
    [...labels].forEach((label) => label.addEventListener('click', this._clickEmojiHandler));
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._clickFavoriteHandler);
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._clickInWatchlistHandler);
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._clickWatchedHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', () => {
        this._commentText = this.getElement().querySelector('.film-details__comment-input').value;
      });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.clickClose);
  }

  static _parseFilmToData(film) {
    return Object.assign({}, film, {
      isFavorite: film.userDetails.isFavorite,
      isInWatchlist: film.userDetails.isInWatchlist,
      isWatched: film.userDetails.isWatched,
      emoji: null,
      description: null,
    });
  }

  static _parseDataToFilm(data) {
    const filmData = Object.assign({}, data);
    filmData.userDetails.isFavorite = filmData.isFavorite;
    filmData.userDetails.isInWatchlist = filmData.isInWatchlist;
    filmData.userDetails.isWatched = filmData.isWatched;
    delete filmData.isFavorite;
    delete filmData.isInWatchlist;
    delete filmData.isWatched;
    delete filmData.emoji;
    return filmData;
  }

  getUpdatedFilm() {
    return FilmPopup._parseDataToFilm(this._data);
  }

  _clickCloseButtonHandler(evt) {
    evt.preventDefault();
    this._callback.clickClose();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.clickClose = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._clickCloseButtonHandler);
  }

  getTemplate() {
    return getFilmPopup(this._data);
  }
}
