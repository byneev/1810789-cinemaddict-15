import { UpdateType } from '../constants.js';
import AbstractObserver from '../utils/abstract-observer.js';
import { updateArray } from '../utils/common.js';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films;
    this._notify(UpdateType.INIT);
  }

  getFilms() {
    return this._films;
  }

  getFilmById(id) {
    let currentFilm;
    this.getFilms().forEach((film) => {
      if (film.id === id) {
        currentFilm = film;
      }
    });
    return currentFilm;
  }

  updateFilm(updateType, updatedFilm) {
    if (!this._films.map((item) => item.id).includes(updatedFilm.id)) {
      return;
    }
    this._films = updateArray(this._films, updatedFilm);
    this._notify(updateType, updatedFilm);
  }
}
