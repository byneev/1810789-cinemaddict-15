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
}
