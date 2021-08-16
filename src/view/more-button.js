import { createElement } from '../utils.js';

const getMoreButton = () => '<button class="films-list__show-more">Show more</button>';

export default class MoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getMoreButton();
  }

  getElement() {
    if (!this._element) {
      return createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
