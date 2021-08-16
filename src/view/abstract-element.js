import { createElement } from '../utils/common.js';

createElement;
export default class AbstractElement {
  constructor() {
    if (new.target === AbstractElement) {
      throw new Error('AbstractElement is abstract class and cant be instantinate');
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error('getTemplate function should be implemented');
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
