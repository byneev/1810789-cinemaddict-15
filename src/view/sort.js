import { createElement } from '../utils.js';

const getSort = () => `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`;

export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getSort();
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
