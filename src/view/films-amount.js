import AbstractElement from './abstract-element.js';

const getFilmsAmount = (filmsCount) => `<p>${filmsCount} movies inside</p>`;

export default class FilmsAmount extends AbstractElement {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return getFilmsAmount(this._filmsCount);
  }
}
