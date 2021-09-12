import { DataType, MethodType, UpdateType } from './constants.js';
import Adapter from './utils/adapter.js';

export default class Api {
  constructor(autorization, adress) {
    this._authorization = autorization;
    this._adress = adress;
  }

  getFilms() {
    return this._load({ url: 'movies' })
      .then((response) => response.json())
      .then((movies) => movies.map((movie) => Adapter.serverToClientData(movie, DataType.FILM)));
  }

  updateFilm(update) {
    return this._load({
      url: `movies/${update.id}`,
      method: MethodType.PUT,
      body: JSON.stringify(Adapter.cLientToServerData(update, DataType.FILM)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then((response) => response.json());
  }

  getComments(id) {
    return this._load({ url: `comments/${id}` })
      .then((response) => response.json())
      .then((comments) => comments.map((comment) => Adapter.serverToClientData(comment, DataType.COMMENT)));
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: MethodType.DELETE,
    });
  }

  addComment(film, newComment) {
    return this._load({
      url: `comments/${film.id}`,
      method: MethodType.POST,
      body: JSON.stringify(Adapter.cLientToServerData(newComment)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then((response) => response.json());
  }

  _load({ url, method = MethodType.GET, body = null, headers = new Headers() }) {
    headers.append('Authorization', this._authorization);
    return fetch(`${this._adress}/${url}`, {
      method,
      body,
      headers,
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw new Error(response.status);
      })
      .catch((error) => {
        throw error;
      });
  }
}
