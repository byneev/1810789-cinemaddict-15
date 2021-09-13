import { SNAKE_ANIMATION_TIMEOUT } from '../constants.js';
import { createElement } from '../utils/common.js';

export default class AbstractElement {
  constructor() {
    if (new.target === AbstractElement) {
      throw new Error('AbstractElement is abstract class and cant be instantinate');
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('getTemplate function should be implemented');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  snake(callback) {
    this.getElement().style.animation = `snake ${SNAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SNAKE_ANIMATION_TIMEOUT);
  }
}
