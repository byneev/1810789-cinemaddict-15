import AbstractElement from './abstract-element.js';

const getFilmsList = (activeMenuItem) => {
  let message;
  switch (activeMenuItem) {
    case '#all':
      message = 'There are no movies in our database';
      break;
    case '#watchlist':
      message = 'There are no movies to watch now';
      break;
    case '#history':
      message = 'There are no watched movies now';
      break;
    case '#favorites':
      message = 'There are no favorite movies now';
      break;
  }
  return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">${message}</h2>
    </section></section>`;
};

export default class FilmListEmpty extends AbstractElement {
  constructor(activeMenuItem) {
    super();
    this._activeMenuItem = activeMenuItem;
  }

  getTemplate() {
    return getFilmsList(this._activeMenuItem);
  }
}
