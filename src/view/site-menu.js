import AbstractElement from './abstract-element.js';

const getSiteMenu = (filmsCountByFilters) => {
  const { isWatchedCount, isInWatchlistCount, isFavoriteCount } = filmsCountByFilters;
  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${isInWatchlistCount}</span></a>
    <a href="#history" class="main-navigation__item main-navigation__item--active">History <span class="main-navigation__item-count">${isWatchedCount}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${isFavoriteCount}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class SiteMenu extends AbstractElement {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return getSiteMenu(this._films);
  }
}
