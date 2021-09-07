import { DataType, MethodType } from './constants.js';
import Adapter from './utils/adapter.js';

export default class Api {
  constructor(autorization, adress) {
    this._authorization = autorization;
    this._adress = adress;
  }

  getFilms() {
    return this._load('movies').then((movies) => Adapter.serverToClientData(movies, DataType.FILM));
  }

  updateFilm(update) {
    return this._load(`movies/${update.id}`, {
      method: MethodType.PUT,
      body: JSON.stringify(Adapter.cLientToServerData(update)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
  }

  getComments(film) {
    return this._load(`comments/${film.id}`).then((comments) => Adapter.serverToClientData(comments, DataType.COMMENT));
  }

  deleteComment(comment) {
    this._load(`comments/${comment.id}`, {
      method: MethodType.DELETE,
    });
  }

  addComment(film, newComment) {
    return this._load(`comments/${film.id}`, {
      method: MethodType.POST,
      body: JSON.stringify(Adapter.cLientToServerData(newComment)),
    });
  }

  _load(url, method = MethodType.GET, body = null, headers = new Headers()) {
    headers.append('Authorization', this._authorization);
    return fetch(`${this._adress}${url}`, {
      method,
      body,
      headers,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Error ${response.status}`);
    });
  }
}
