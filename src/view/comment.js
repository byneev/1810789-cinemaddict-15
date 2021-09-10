import AbstractElement from './abstract-element.js';
import dayjs from 'dayjs';
import he from 'he';

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
  const { author, message, date, emotion, id } = comment;
  const emotionUrl = `/images/emoji/${emotion}.png`;
  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="${emotionUrl}" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(message)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date !== null ? formatDateByOld(date) : ''}</span>
      <button data-id="${id}" class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

export default class Comment extends AbstractElement {
  constructor(comment) {
    super();
    this._comment = comment;
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    this._callback.deleteHandler(evt);
  }

  setCommentDeleteHandler(callback) {
    this._callback.deleteHandler = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._commentDeleteHandler);
  }

  getTemplate() {
    return getComment(this._comment);
  }
}
