import { ActionType, UpdateType } from '../constants.js';
import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  getObserverCount() {
    return this._observers.size;
  }

  setPresenter(presenter) {
    this._presenter = presenter;
  }

  getPresenter() {
    return this._presenter;
  }

  setComments(comments, actionType = ActionType.PATCH) {
    this._comments = comments;
    this._notify(this._comments, actionType);
  }

  getComments() {
    return this._comments;
  }

  deleteComment(id, actionType) {
    this._comments = this._comments.filter((comment) => comment.id !== id);
    this._notify(this._comments, actionType);
  }
}
