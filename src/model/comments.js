import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments;
  }

  getComments() {
    return this._comments;
  }

  deleteComment(id) {
    this._comments = this._comments.filter((comment) => comment.id !== +id);
    this._notify(true);
  }

  addComment(data) {
    this._comments.push(data);
    this._notify(false);
  }
}
