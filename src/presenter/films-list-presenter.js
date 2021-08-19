import { render, RenderPosition } from '../utils/render.js';
import FilmsListView from '../view/films-list.js';
import FilmPresenter from './film-presenter.js';

export default class filmsList {
  constructor(container) {
    this.MAX_FILMS_COUNT = 5;
    this._filmPresenters = new Map();
    this._filmsListContainer = container;
    this._filmsListComponent = new FilmsListView();
    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    render(this._filmsListContainer, this._filmsListComponent, RenderPosition.BEFOREEND);
    this.renderFilmsList();
  }

  _handleFilmChange(updatedFilm) {
    // TODO
    // реализовать функцию updateArray, которая изменяет один элемент в массиве
    // updateArray(array, element)
    // перерисовать измененный элемент (находим по id)
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListComponent, this._handleFilmChange);
    filmPresenter.init(film);
    this._filmPresenters.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(film));
  }

  _renderLoadMoreButton() {
    //TODO
  }

  _renderFilmsList() {
    //TODO
    //в этом методе все собирается в кучу
  }
}
