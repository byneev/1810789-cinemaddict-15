import { FilterType } from '../constants.js';
import AbstractElement from './abstract-element.js';

const getSiteMenu = (filmsCountByFilters, currentFilter) => {
  const { isWatched, isInWatchlist, isFavorite } = filmsCountByFilters;
  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" data-filter="all" class="main-navigation__item
    ${currentFilter === FilterType.ALL ? 'main-navigation__item--active' : ''}">All movies</a>
    <a href="#watchlist" data-filter="isInWatchlist" class="main-navigation__item
    ${currentFilter === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${isInWatchlist}</span></a>
    <a href="#history" data-filter="isWatched" class="main-navigation__item
    ${currentFilter === FilterType.HISTORY ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${isWatched}</span></a>
    <a href="#favorites" data-filter="isFavorite" class="main-navigation__item
    ${currentFilter === FilterType.FAVORITES ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${isFavorite}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class SiteMenu extends AbstractElement {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._siteMenuItemClickHandler = this._siteMenuItemClickHandler.bind(this);
  }

  _siteMenuItemClickHandler(evt) {
    evt.preventDefault();
    this._callback.siteMenuItemClick(evt);
  }

  setSiteMenuItemClickHandler(callback) {
    this._callback.siteMenuItemClick = callback;
    [...this.getElement().querySelectorAll('.main-navigation__item')].forEach((item) => item.addEventListener('click', this._siteMenuItemClickHandler));
  }

  getTemplate() {
    return getSiteMenu(this._filters, this._currentFilter);
  }
}
