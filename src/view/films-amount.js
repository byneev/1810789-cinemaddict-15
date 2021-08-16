import { createElement } from '../utils.js';

const getFilmsAmount = (films) => `<p>${films.length} movies inside</p>`;

export default class FilmsAmount {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return getFilmsAmount(this._films);
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
