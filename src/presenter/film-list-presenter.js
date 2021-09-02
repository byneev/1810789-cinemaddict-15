import { UpdateType } from '../constants.js';
import { remove } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import FilmListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import MoreButtonView from '../view/more-button.js';
import FilmPresenter from './film-presenter.js';

const MAX_FILMS_COUNT = 5;

export default class FilmListPresenter {
  constructor(container, siteMenuComponent, filmsModel, filterModel) {
    this._filterModel = filterModel; //реализовать модель фильтров
    this._filmsModel = filmsModel;
    this._siteMenuComponent = siteMenuComponent;
    this._renderedFilmsCount = MAX_FILMS_COUNT;
    this._filmPresenters = new Map();
    this._container = container;
    this._moreButtonComponent = null;
    this._filmsListComponent = new FilmsListView();
    this._handleFilmViewAction = this._handleFilmViewAction.bind(this);
    this._closeAllPopups = this._closeAllPopups.bind(this);
    this._renderFilms = this._renderFilms.bind(this);
    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);
    this._moreButtonClickHandler = this._moreButtonClickHandler.bind(this);
    this._handleRenderPopup = this._handleRenderPopup.bind(this);
  }

  _getFilms() {
    // здесь происходит фильтрация на основе this._filtersModel.getCurrentFilter
    return this._filmsModel.getFilms();
  }

  init() {
    this._filmsModel.addObserver(this._handleFilmsModelEvent);
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector('.films-list__container');
    render(this._container, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderFilmsList();
  }

  _handleFilmViewAction(updateType, update) {
    this._filmsModel.updateFilm(updateType, update);
  }

  _handleRenderPopup(film) {
    this._filmPresenters.get(film.id).isOpen = true;
  }

  _renderUpdatedFilm(data) {
    const currentFilmPresenter = this._filmPresenters.get(data.id);
    currentFilmPresenter.init(data);
    if (currentFilmPresenter.isOpen) {
      const currentScroll = currentFilmPresenter._filmDetailsComponent.getElement().scrollTop;
      this._closeAllPopups();
      currentFilmPresenter._renderPopup(data);
      currentFilmPresenter._filmDetailsComponent.getElement().scrollTop = currentScroll;
    }
  }

  _handleFilmsModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._renderUpdatedFilm(data);
      // в рендер попап не перерисовываются фаворит, вочлист и т д
      // обновить фильтры
      case UpdateType.MAJOR:
      // очистить фильм-лист
      // отрисовать фильм-лист
      // обновить фильтры
      case UpdateType.PATCH:
      //
    }
  }

  _closeAllPopups() {
    this._filmPresenters.forEach((value) => {
      if (value.isOpen) {
        value._closePopup();
      }
    });
  }

  _renderFilm(film) {
    this._filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleFilmViewAction, this._closeAllPopups, this._filmsModel, this._filterModel, this._handleRenderPopup);
    this._filmPresenter.init(film);
    this._filmPresenters.set(film.id, this._filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  _clearFilmsList() {
    if (this._moreButtonComponent !== null) {
      remove(this._moreButtonComponent);
    }
    this._filmPresenters.forEach((filmPresenter) => remove(filmPresenter._filmCardComponent));
    this._filmPresenters.clear();
    this._closeAllPopups();
  }

  _renderFilmsList() {
    const films = this._getFilms();
    if (films.length === 0) {
      const siteMenuActiveItemHref = this._siteMenuComponent.getElement().querySelector('.main-navigation__item--active').getAttribute('href');
      render(this._filmsListContainer, new FilmListEmptyView(siteMenuActiveItemHref), RenderPosition.BEFOREEND);
      return;
    }
    this._renderFilms(films.slice(0, Math.min(films.length, this._renderedFilmsCount)));
    if (films.length > this._renderedFilmsCount) {
      this._moreButtonComponent = new MoreButtonView();
      render(this._filmsListContainer, this._moreButtonComponent, RenderPosition.AFTER);
      this._moreButtonComponent.setClickHandler(this._moreButtonClickHandler);
    }
  }

  _moreButtonClickHandler() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + MAX_FILMS_COUNT);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);
    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmsCount;
    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._moreButtonComponent);
    }
  }
}
