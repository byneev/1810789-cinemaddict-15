import { FilterType, UpdateType } from '../constants.js';
import { remove, replace } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import FilmListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import MoreButtonView from '../view/more-button.js';
import FilmPresenter from './film-presenter.js';
import ProfileView from '../view/profile.js';
import SiteMenuView from '../view/site-menu.js';
import SortView from '../view/sort.js';
import { getCountByFilters } from '../utils/common.js';

const MAX_FILMS_COUNT = 5;
//TODO При нажатии фаворит вотчед и т д текуший фильтр становится фаворит вотчед и т д
//TODO При нажатии фаворт вотчед и т д в попапе, все ломается
export default class MainPresenter {
  constructor(mainContainer, headerContainer, filmsModel, filterModel) {
    this._currentFilter = FilterType.ALL;
    this._filterModel = filterModel; //реализовать модель фильтров
    this._filmsModel = filmsModel;
    this._renderedFilmsCount = MAX_FILMS_COUNT;
    this._filmPresenters = new Map();
    this._mainContainer = mainContainer;
    this._headerContainer = headerContainer;
    this._moreButtonComponent = null;
    this._filmsListComponent = new FilmsListView();
    this._filmListEmptyComponent = null;
    this._handleFilmViewAction = this._handleFilmViewAction.bind(this);
    this._closeAllPopups = this._closeAllPopups.bind(this);
    this._renderFilms = this._renderFilms.bind(this);
    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);
    this._moreButtonClickHandler = this._moreButtonClickHandler.bind(this);
    this._handleRenderPopup = this._handleRenderPopup.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
    this._handleFilterModelEvent = this._handleFilterModelEvent.bind(this);
    this._handleSiteMenuViewAction = this._handleSiteMenuViewAction.bind(this);
  }

  _getFilms() {
    switch (this._currentFilter) {
      case FilterType.WATCHLIST:
        return this._filmsModel.getFilms().filter((film) => film.userDetails.isInWatchlist);
      case FilterType.HISTORY:
        return this._filmsModel.getFilms().filter((film) => film.userDetails.isWatched);
      case FilterType.FAVORITES:
        return this._filmsModel.getFilms().filter((film) => film.userDetails.isFavorite);
      default:
        return this._filmsModel.getFilms();
    }
  }

  init() {
    const filmsCountByFilters = getCountByFilters(this._getFilms());
    this._filterModel.setFilters(filmsCountByFilters);
    this._filmsModel.addObserver(this._handleFilmsModelEvent);
    this._filterModel.addObserver(this._handleFilterModelEvent);
    this._renderBoard();
  }

  _handleSiteMenuClick(evt) {
    const value = evt.target.dataset.filter;
    this._handleSiteMenuViewAction(value);
  }

  _handleFilmViewAction(updateType, update, filterType = FilterType.ALL, filterUpdate) {
    this._filterModel.updateFilters(filterType, filterUpdate);
    this._filmsModel.updateFilm(updateType, update);
    this._filterModel.setCurrentFilterType(filterType);
  }

  _handleSiteMenuViewAction(filterType) {
    this._filterModel.setCurrentFilterType(filterType);
  }

  _handleFilterModelEvent(filterType) {
    if (filterType === this._currentFilter) {
      return;
    }
    this._currentFilter = filterType;
    this._renderedFilmsCount = MAX_FILMS_COUNT;
    this._clearBoard();
    this._renderBoard();
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

  _replaceSiteMenu() {
    const newSiteMenu = new SiteMenuView(this._filterModel.getFilters());
    replace(newSiteMenu, this._siteMenuComponent);
    this._siteMenuComponent = newSiteMenu;
  }

  _replaceProfile() {
    const newProfile = new ProfileView(this._filterModel.getFilters());
    replace(newProfile, this._profileComponent);
    this._profileComponent = newProfile;
  }

  _handleFilmsModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._renderUpdatedFilm(data);
        this._replaceSiteMenu();
        this._replaceProfile();
        break;
      case UpdateType.MAJOR:
        this._clearBoard();
        this._renderBoard();
        break;
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

  _clearBoard() {
    if (this._moreButtonComponent !== null) {
      remove(this._moreButtonComponent);
    }
    remove(this._siteMenuComponent);
    remove(this._profileComponent);
    remove(this._sortViewComponent);
    remove(this._filmListEmptyComponent);
    this._filmPresenters.forEach((filmPresenter) => remove(filmPresenter._filmCardComponent));
    this._filmPresenters.clear();
    this._closeAllPopups();
  }

  _renderBoard() {
    const films = this._getFilms();
    this._siteMenuComponent = new SiteMenuView(this._filterModel.getFilters(), this._currentFilter);
    this._siteMenuComponent.setSiteMenuItemClickHandler(this._handleSiteMenuClick);
    this._profileComponent = new ProfileView(this._filterModel.getFilters());
    this._sortViewComponent = new SortView();
    render(this._headerContainer, this._profileComponent, RenderPosition.BEFOREEND);
    render(this._mainContainer, this._siteMenuComponent, RenderPosition.BEFOREEND);
    render(this._mainContainer, this._sortViewComponent, RenderPosition.BEFOREEND);
    render(this._mainContainer, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector('.films-list__container');
    if (films.length === 0) {
      const siteMenuActiveItemHref = this._siteMenuComponent.getElement().querySelector('.main-navigation__item--active').getAttribute('href');
      this._filmListEmptyComponent = new FilmListEmptyView(siteMenuActiveItemHref);
      render(this._filmsListContainer, this._filmListEmptyComponent, RenderPosition.BEFOREEND);
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
