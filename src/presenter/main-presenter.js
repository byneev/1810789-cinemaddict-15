import { FilterType, SortType, UpdateType } from '../constants.js';
import { remove, replace, sortByType } from '../utils/common.js';
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
//TODO 6-й фильм багает
//TODO При нажатии фаворт вотчед и т д в попапе, все ломается
export default class MainPresenter {
  constructor(mainContainer, headerContainer, filmsModel, filterModel, commentModel) {
    this._currentFilter = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentModel = commentModel;
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
    this._sortItemClickHandler = this._sortItemClickHandler.bind(this);
  }

  _getFilms() {
    let currentFilms = [];
    switch (this._currentFilter) {
      case FilterType.WATCHLIST:
        currentFilms = this._filmsModel.getFilms().filter((film) => film.userDetails.isInWatchlist);
        break;
      case FilterType.HISTORY:
        currentFilms = this._filmsModel.getFilms().filter((film) => film.userDetails.isWatched);
        break;
      case FilterType.FAVORITES:
        currentFilms = this._filmsModel.getFilms().filter((film) => film.userDetails.isFavorite);
        break;
      default:
        currentFilms = this._filmsModel.getFilms();
        break;
    }
    return sortByType(currentFilms, this._currentSortType);
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
  }

  _handleSiteMenuViewAction(filterType) {
    this._filterModel.setCurrentFilterType(filterType);
  }

  _handleFilterModelEvent(filterType) {
    this._currentFilter = filterType;
    this._renderedFilmsCount = MAX_FILMS_COUNT;
    this._clearBoard();
    this._renderBoard();
  }

  _sortItemClickHandler(evt) {
    const sortType = evt.target.dataset.sort;
    if (sortType === this._currentSortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _handleRenderPopup(film, isOpen) {
    this._filmPresenters.get(film.id).isOpen = isOpen;
  }

  _renderUpdatedFilm(data) {
    const currentFilmPresenter = this._filmPresenters.get(data.id);
    this._filmPresenters.get(data.id).init(data);
    if (currentFilmPresenter.isOpen) {
      const currentScroll = currentFilmPresenter._filmDetailsComponent.getElement().scrollTop;
      this._closeAllPopups();
      currentFilmPresenter._renderPopup(data);
      currentFilmPresenter._filmDetailsComponent.getElement().scrollTop = currentScroll;
    }
  }

  _replaceSiteMenu() {
    const newSiteMenu = new SiteMenuView(this._filterModel.getFilters(), this._currentFilter);
    replace(newSiteMenu, this._siteMenuComponent);
    this._siteMenuComponent = newSiteMenu;
    this._siteMenuComponent.setSiteMenuItemClickHandler(this._handleSiteMenuClick);
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
        this._currentFilter = this._filterModel.getCurrentFilterType();
        this._replaceSiteMenu(); // если добавляется в фаворит, вотчед и т.д., нужно не не переходить в текущий фильтр
        this._replaceProfile();
        break;
      case UpdateType.MAJOR:
        this._closeAllPopups();
        this._clearBoard();
        this._currentFilter = this._filterModel.getCurrentFilterType();
        this._renderBoard();
        break;
      case UpdateType.PATCH:
    }
  }

  _closeAllPopups() {
    this._filmPresenters.forEach((value) => {
      if (value.isOpen) {
        value._closePopup();
        value.isOpen = false;
      }
    });
  }

  _renderFilm(film) {
    this._filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleFilmViewAction, this._closeAllPopups, this._filmsModel, this._filterModel, this._commentModel, this._handleRenderPopup);
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
    this._sortViewComponent = new SortView(this._currentSortType);
    this._sortViewComponent.setSortItemClickHandler(this._sortItemClickHandler);
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
