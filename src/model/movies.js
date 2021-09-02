import AbstractObserver from '../utils/abstract-observer.js';
import { updateArray } from '../utils/common.js';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films;
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, updatedFilm) {
    if (!this._films.map((item) => item.id).includes(updatedFilm.id)) {
      return;
    }
    this._films = updateArray(this._films, updatedFilm);
    this._notify(updateType, updatedFilm);
  }
}
