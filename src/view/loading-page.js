import AbstractElement from './abstract-element.js';

const getLoadingPage = () => `<div>
<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">0</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">0</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">0</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>
<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>
</section>
</div>`;

export default class LoadingPage extends AbstractElement {
  _getTemplate() {
    return getLoadingPage();
  }
}
