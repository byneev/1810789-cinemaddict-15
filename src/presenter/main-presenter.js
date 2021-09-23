import { FilterType, SortType, UpdateType, MAX_FILMS_COUNT, ListType } from '../constants.js';
import { checkEqualArrays, remove, replace, sortByType } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import FilmListEmptyView from '../view/films-list-empty.js';
import FilmsListView from '../view/films-list.js';
import MoreButtonView from '../view/more-button.js';
import FilmPresenter from './film-presenter.js';
import ProfileView from '../view/profile.js';
import SiteMenuView from '../view/site-menu.js';
import SortView from '../view/sort.js';
import { getCountByFilters } from '../utils/common.js';
import LoadingPageView from '../view/loading-page.js';
import FilmsAmountView from '../view/films-amount.js';
import StatisticView from '../view/statistic.js';
import FilmListExtra from '../view/film-list-extra.js';

export default class MainPresenter {
  constructor(mainContainer, headerContainer, filmsModel, filterModel, commentModel, api, provider) {
    this._totalFilmsCount = 0;
    this._isLoading = false;
    this._currentFilter = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentModel = commentModel;
    this._api = api;
    this._provider = provider;
    this._renderedFilmsCount = MAX_FILMS_COUNT;
    this._filmPresenters = new Map();
    this._mainContainer = mainContainer;
    this._headerContainer = headerContainer;
    this._moreButtonComponent = null;
    this._loadingComponent = new LoadingPageView();
    this._filmsListComponent = new FilmsListView();
    this._filmListEmptyComponent = null;
    this._filmsAmountComponent = null;
    this._statisticComponent = null;
    this._handleFilmViewAction = this._handleFilmViewAction.bind(this);
    this._closeAllPopups = this._closeAllPopups.bind(this);
    this._renderFilms = this._renderFilms.bind(this);
    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);
    this._moreButtonClickHandler = this._moreButtonClickHandler.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
    this._handleFilterModelEvent = this._handleFilterModelEvent.bind(this);
    this._handleSiteMenuViewAction = this._handleSiteMenuViewAction.bind(this);
    this._sortItemClickHandler = this._sortItemClickHandler.bind(this);
    this._handleSiteMenuStatsClick = this._handleSiteMenuStatsClick.bind(this);
    this._updateCommentedList = this._updateCommentedList.bind(this);
  }

  _getFilms() {
    this._currentFilms = this._filmsModel.getFilms();
    switch (this._currentFilter) {
      case FilterType.WATCHLIST:
        return sortByType(
          this._currentFilms.filter((film) => film.userDetails.isInWatchlist),
          this._currentSortType
        );
      case FilterType.HISTORY:
        return sortByType(
          this._currentFilms.filter((film) => film.userDetails.isWatched),
          this._currentSortType
        );
      case FilterType.FAVORITES:
        return sortByType(
          this._currentFilms.filter((film) => film.userDetails.isFavorite),
          this._currentSortType
        );
    }
    return sortByType(this._currentFilms, this._currentSortType);
  }

  init() {
    this._renderLoadingPage();
    this._provider.getFilms().then((films) => {
      this._filmsModel.setFilms(films);
    });
    this._filmsModel.addObserver(this._handleFilmsModelEvent);
    this._filterModel.addObserver(this._handleFilterModelEvent);
  }

  _handleSiteMenuClick(evt) {
    const value = evt.target.dataset.filter;
    this._handleSiteMenuViewAction(value);
  }

  _handleFilmViewAction(updateType, update, filterType = FilterType.ALL, filterUpdate) {
    this._filmPresenters.get(update.id).removeListeners();
    this._provider.updateFilm(update).then((data) => {
      this._filterModel.updateFilters(filterType, filterUpdate);
      this._filmsModel.updateFilm(updateType, data, filterType, filterUpdate);
    });
  }

  _handleSiteMenuViewAction(filterType) {
    this._currentSortType = SortType.DEFAULT;
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
    console.log(sortType);
    this._currentSortType = sortType;
    this._renderedFilmsCount = MAX_FILMS_COUNT;
    this._clearBoard();
    this._renderBoard();
  }

  _renderLoadingPage() {
    render(this._mainContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _replaceSiteMenu() {
    const newSiteMenu = new SiteMenuView(this._filterModel.getFilters(), this._currentFilter);
    replace(newSiteMenu, this._siteMenuComponent);
    this._siteMenuComponent = newSiteMenu;
    this._siteMenuComponent.setSiteMenuItemClickHandler(this._handleSiteMenuClick);
    this._siteMenuComponent.setSiteMenuStatsClickHandler(this._handleSiteMenuStatsClick);
  }

  _replaceProfile() {
    const newProfile = new ProfileView(this._filterModel.getFilters());
    replace(newProfile, this._profileComponent);
    this._profileComponent = newProfile;
  }

  _handleFilmsModelEvent(updateType, data) {
    let currentFilmPresenter;
    switch (updateType) {
      case UpdateType.MINOR:
        currentFilmPresenter = this._filmPresenters.get(data.id);
        if (currentFilmPresenter.isInList) {
          currentFilmPresenter.init(data, this._filmsListContainer);
        }
        if (currentFilmPresenter.isInRatedList) {
          currentFilmPresenter.init(data, this._commentedListContainer, ListType.RATED);
        }
        if (currentFilmPresenter.isOpen) {
          currentFilmPresenter._clearCommentsBlock();
          currentFilmPresenter._renderCommentsBlock(this._commentModel.getComments());
          currentFilmPresenter.setScrollPopup();
        }
        this._currentFilter = this._filterModel.getCurrentFilterType();
        this._replaceSiteMenu();
        this._replaceProfile();
        currentFilmPresenter.setListeners();
        this._updateCommentedList();
        if (currentFilmPresenter.isInCommentedList) {
          currentFilmPresenter.init(data, this._commentedListContainer, ListType.COMMENTED);
        }

        break;
      case UpdateType.MAJOR:
        this._closeAllPopups();
        this._clearBoard();
        this._currentFilter = this._filterModel.getCurrentFilterType();
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._totalFilmsCount = this._filmsModel.getFilms().length;
        remove(this._loadingComponent);
        this._filterModel.setFilters(getCountByFilters(this._getFilms()));
        this._clearBoard();
        this._renderBoard();
        break;
    }
  }

  _closeAllPopups() {
    this._filmPresenters.forEach((value) => {
      if (value.isOpen) {
        value.closePopup();
        value.isOpen = false;
      }
    });
  }

  _renderFilm(film, container, listType) {
    if (this._filmPresenters.has(film.id)) {
      this._filmPresenters.get(film.id).init(film, container, listType);
      return;
    }
    this._filmPresenter = new FilmPresenter(this._handleFilmViewAction, this._closeAllPopups, this._filmsModel, this._filterModel, this._commentModel, this._api);
    this._filmPresenter.init(film, container, listType);
    this._filmPresenters.set(film.id, this._filmPresenter);
  }

  _renderFilms(films, container, listType) {
    films.forEach((film) => this._renderFilm(film, container, listType));
  }

  _clearBoard() {
    if (this._moreButtonComponent !== null) {
      remove(this._moreButtonComponent);
    }
    remove(this._siteMenuComponent);
    remove(this._profileComponent);
    remove(this._sortViewComponent);
    remove(this._filmListEmptyComponent);
    remove(this._filmsAmountComponent);
    remove(this._statisticComponent);
    remove(this._filmsList);
    remove(this._commentedFilmListComponent);
    remove(this._ratedFilmListComponent);
    this._filmPresenters.forEach((filmPresenter) => remove(filmPresenter._filmCardComponent));
    this._filmPresenters.clear();
  }

  _renderSiteMenu(filter) {
    this._siteMenuComponent = new SiteMenuView(this._filterModel.getFilters(), filter);
    this._siteMenuComponent.setSiteMenuItemClickHandler(this._handleSiteMenuClick);
    this._siteMenuComponent.setSiteMenuStatsClickHandler(this._handleSiteMenuStatsClick);
    render(this._mainContainer, this._siteMenuComponent, RenderPosition.BEFOREEND);
  }

  _renderStatistic() {
    this._currentSortType = SortType.DEFAULT;
    this._statisticComponent = new StatisticView(this._filmsModel.getFilms());
    this._statisticComponent.setStatsFilterClickHandler();
    render(this._mainContainer, this._statisticComponent, RenderPosition.BEFOREEND);
  }

  _handleSiteMenuStatsClick() {
    this._clearBoard();
    this._renderProfile();
    this._renderSiteMenu(FilterType.NONE);
    this._renderStatistic();
    this._statisticComponent.initStats();
    this._renderFooter();
  }

  _renderProfile() {
    this._profileComponent = new ProfileView(this._filterModel.getFilters());
    render(this._headerContainer, this._profileComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    this._sortViewComponent = new SortView(this._currentSortType);
    this._sortViewComponent.setSortItemClickHandler(this._sortItemClickHandler);
    render(this._mainContainer, this._sortViewComponent, RenderPosition.BEFOREEND);
  }

  _renderFooter() {
    this._footerContainer = document.querySelector('.footer__statistics');
    this._filmsAmountComponent = new FilmsAmountView(this._totalFilmsCount);
    render(this._footerContainer, this._filmsAmountComponent, RenderPosition.BEFOREEND);
  }

  _renderCommentedFilmList() {
    this._commentedFilmListComponent = new FilmListExtra(ListType.COMMENTED);
    render(this._ratedFilmListComponent, this._commentedFilmListComponent, RenderPosition.BEFORE);
    this._commentedListContainer = this._commentedFilmListComponent.getElement().querySelector('.films-list__container');
    this._mostCommentedFilms = sortByType(this._filmsModel.getFilms(), SortType.COMMENTS);
    this._renderFilms(this._mostCommentedFilms.slice(0, 2), this._commentedListContainer, ListType.COMMENTED);
  }

  _renderRatedFilmList() {
    this._ratedFilmListComponent = new FilmListExtra(ListType.RATED);
    render(this._filmsListComponent, this._ratedFilmListComponent, RenderPosition.BEFOREEND);
    this._ratedListContainer = this._ratedFilmListComponent.getElement().querySelector('.films-list__container');
    const sortedFilms = sortByType(this._filmsModel.getFilms(), SortType.RATING);
    this._renderFilms(sortedFilms.slice(0, 2), this._ratedListContainer, ListType.RATED);
  }

  _updateCommentedList() {
    const newMostCommented = sortByType(this._filmsModel.getFilms(), SortType.COMMENTS);
    if (checkEqualArrays(this._mostCommentedFilms.slice(0, 2), newMostCommented.slice(0, 2))) {
      return;
    }
    remove(this._commentedFilmListComponent);
    this._filmPresenters.forEach((presenter) => (presenter.isInCommentedList = false));
    this._renderCommentedFilmList();
  }

  _renderBoard() {
    const films = this._getFilms();
    this._renderProfile();
    this._renderSiteMenu(this._currentFilter);
    this._renderSort();
    render(this._mainContainer, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._filmsListContainer = this._filmsListComponent.getElement().querySelector('.films-list__container');
    if (films.length === 0) {
      const siteMenuActiveItemHref = this._siteMenuComponent.getElement().querySelector('.main-navigation__item--active').getAttribute('href');
      this._filmListEmptyComponent = new FilmListEmptyView(siteMenuActiveItemHref);
      render(this._filmsListContainer, this._filmListEmptyComponent, RenderPosition.BEFOREEND);
      this._renderFooter();
      return;
    }
    this._renderFilms(films.slice(0, Math.min(films.length, this._renderedFilmsCount)), this._filmsListContainer, ListType.DEFAULT);
    if (films.length > this._renderedFilmsCount) {
      this._moreButtonComponent = new MoreButtonView();
      render(this._filmsListContainer, this._moreButtonComponent, RenderPosition.AFTER);
      this._moreButtonComponent.setClickHandler(this._moreButtonClickHandler);
    }
    this._renderRatedFilmList();
    this._renderCommentedFilmList();
    this._renderFooter();
  }

  _moreButtonClickHandler() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + MAX_FILMS_COUNT);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);
    this._renderFilms(films, this._filmsListContainer, ListType.DEFAULT);
    this._renderedFilmsCount = newRenderedFilmsCount;
    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._moreButtonComponent);
    }
  }
}
