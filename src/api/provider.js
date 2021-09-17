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

  getFilms() {
    if (isOnline) {
      return this._api.getFilms().then((films) => {
        this._store.setItems(covertDataForStore(films.map(Adapter.cLientToServerData)));
        return films;
      });
    }

    const filmsList = this._store.getItems().values().map(Adapter.serverToClientData);
    return Promise.resolve(filmsList);
  }

  updateFilm(update) {
    if (isOnline) {
      return this._api.updateFilm(update).then((updatedFilm) => {
        this._store.setItem(updatedFilm.id, Adapter.cLientToServerData(updatedFilm));
        return updatedFilm;
      });
    }

    this._store.setItem(update.id, Adapter.cLientToServerData(update));
    return Promise.resolve(update);
  }
}
