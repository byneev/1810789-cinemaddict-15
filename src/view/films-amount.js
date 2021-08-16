import AbstractElement from './abstract-element.js';

const getFilmsAmount = (films) => `<p>${films.length} movies inside</p>`;

export default class FilmsAmount extends AbstractElement {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return getFilmsAmount(this._films);
  }
}
