import AbstractElement from './abstract-element.js';

const getFilmListExtra = (type) => `<section class="films-list films-list--extra">
  <h2 class="films-list__title">${type}</h2>
  <div class="films-list__container">
  </div>
</section>`;

export default class FilmListExtra extends AbstractElement {
  constructor(type) {
    super();
    this._type = type;
  }

  _getTemplate() {
    return getFilmListExtra(this._type);
  }
}
