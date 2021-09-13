import { UpdateType } from '../constants.js';
import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setPresenter(presenter) {
    this._presenter = presenter;
  }

  getPresenter() {
    return this._presenter;
  }

  setComments(comments, updateType = UpdateType.PATCH) {
    this._comments = comments;
    this._notify(this._comments, updateType);
  }

  getComments() {
    return this._comments;
  }

  deleteComment(id, updateType) {
    this._comments = this._comments.filter((comment) => comment.id !== id);
    this._notify(this._comments, updateType);
  }
}
