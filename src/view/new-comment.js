import { EMOJIES } from '../constants.js';
import Smart from './smart.js';

const getNewComment = (data) => {
  const currentEmoji = `<img src='images/emoji/${data.emoji}.png' width='55' height='55' alt='emoji-smile'></img>`;

  const emojisList = EMOJIES.map(
    (item) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${item}" value="${item}" ${item === data.emoji ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${item}">
        <img src="./images/emoji/${item}.png" width="30" height="30" alt="emoji">
      </label>`
  ).join('');
  const newComment = `<div class="film-details__new-comment"><div class="film-details__add-emoji-label">
    ${!data.emoji ? '' : currentEmoji}
    </div>
    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
    </label>
    <div class="film-details__emoji-list">
    ${emojisList}
    </div>
  </div>`;
  return newComment;
};

export default class NewComment extends Smart {
  constructor() {
    super();
    this._commentText = null;
    this._data = {
      emoji: null,
      description: null,
    };
    this._clickEmojiHandler = this._clickEmojiHandler.bind(this);
    this._addCommentKeydownHandler = this._addCommentKeydownHandler.bind(this);
    this._setInnerHandlers();
  }

  getData() {
    return this._data;
  }

  updateData(data) {
    super.updateData(data);
    this.getElement().querySelector('.film-details__comment-input').value = this._data.description;
  }

  _clickEmojiHandler(evt) {
    evt.preventDefault();
    this.updateData({
      emoji: evt.target.parentNode.getAttribute('for').split('-')[1],
    });
    this.restoreHandlers();
  }

  _addCommentKeydownHandler(evt) {
    this._callback.addComment(evt);
  }

  setAddCommentKeydownHandler(callback) {
    this._callback.addComment = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._addCommentKeydownHandler);
  }

  _setInnerHandlers() {
    const labels = this.getElement().querySelectorAll('.film-details__emoji-label');
    [...labels].forEach((label) => label.addEventListener('click', this._clickEmojiHandler));
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', () => {
        this._data.description = this.getElement().querySelector('.film-details__comment-input').value;
      });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._addCommentKeydownHandler);
  }

  getTemplate() {
    return getNewComment(this._data);
  }
}
