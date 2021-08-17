import dayjs from 'dayjs';
import AbstractElement from './abstract-element.js';

const getFilmCard = (film) => {
  const { title, rating, realiseDate, runtime, genres, poster, description, commentsList, userDetails } = film;
  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(realiseDate).format('YYYY')}</span>
    <span class="film-card__duration">${runtime}</span>
    <span class="film-card__genre">${genres.join(' ')}</span>
  </p>
  <img src="${poster}" alt="${title}" class="film-card__poster">
  <p class="film-card__description">${description.length >= 140 ? `${description.substring(139)}...` : description}</p>
  <a class="film-card__comments">${commentsList.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist
    ${userDetails.isInWatchlist ? 'film-card__controls-item--active' : ''}" type="button">
    Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched
    ${userDetails.isWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite
    ${userDetails.isFavorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends AbstractElement {
  constructor(film) {
    super();
    this._film = film;
    this._callback = {
      click: null,
    };
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }

  getTemplate() {
    return getFilmCard(this._film);
  }
}
