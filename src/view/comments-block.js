import AbstractElement from './abstract-element.js';

const getCommentsBlock = (commentsCount) => `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
      <h3 class='film-details__comments-title'>
      Comments <span class='film-details__comments-count'>${commentsCount}</span>
    </h3>
    <ul class="film-details__comments-list">
  </ul>
      </section>
    </div>`;

export default class CommentsBlock extends AbstractElement {
  constructor(commentsCount) {
    super();
    this._commentsCount = commentsCount;
  }

  getTemplate() {
    return getCommentsBlock(this._commentsCount);
  }
}
