import { DataType } from '../constants';
import Adapter from '../utils/adapter';
import { isOnline } from '../utils/common.js';

const covertDataForStore = (data) =>
  data.reduce(
    (acc, current) =>
      Object.assign({}, acc, {
        [current.id]: current,
      }),
    {}
  );

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  sync() {
    const items = Object.values(this._store.getItems()); //получаем у стора текущие итемы в серверном формате
    return this._api.sinchronizeData(items).then((films) => films.updated);
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms().then((films) => {
        this._store.setItems(covertDataForStore(films.map((film) => Adapter.cLientToServerData(film, DataType.FILM))));
        return films;
      });
    }

    const filmsList = this._store
      .getItems()
      .values()
      .map((film) => Adapter.serverToClientData(film, DataType.FILM));
    return Promise.resolve(filmsList);
  }

  updateFilm(update) {
    if (isOnline()) {
      return this._api.updateFilm(update).then((updatedFilm) => {
        this._store.setItem(updatedFilm.id, Adapter.cLientToServerData(updatedFilm, DataType.FILM));
        return updatedFilm;
      });
    }
    this._store.setItem(update.id, Adapter.cLientToServerData(update, DataType.FILM));
    return Promise.resolve(update);
  }
}
