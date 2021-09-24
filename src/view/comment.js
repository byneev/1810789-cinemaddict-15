import he from 'he';
import { formatDateByOld, isOnline } from '../utils/common.js';
import { showToast } from '../utils/toast.js';
import Smart from './smart.js';

const getComment = (data) => {
  const { author, message, date, emotion, id, isDisabling } = data;
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
      <button data-id="${id}" class="film-details__comment-delete" ${isDisabling ? 'disabled' : ''}>${isDisabling ? 'Deleting...' : 'Delete'}</button>
    </p>
  </div>
</li>`;
};

export default class Comment extends Smart {
  constructor(comment) {
    super();
    this._comment = comment;
    this._data = this._convertCommentToData();
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
  }

  _convertCommentToData() {
    return Object.assign({}, this._comment, {
      isDisabling: false,
    });
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    if (!isOnline()) {
      showToast();
      return;
    }
    this.updateData({
      isDisabling: true,
    });
    this._callback.deleteHandler(evt);
  }

  setCommentDeleteHandler(callback) {
    this._callback.deleteHandler = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._commentDeleteHandler);
  }

  _restoreHandlers() {
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._commentDeleteHandler);
  }

  _getTemplate() {
    return getComment(this._data);
  }
}
