import { SortType } from '../constants.js';
import AbstractElement from './abstract-element.js';

const getSort = (currentSortType) => `<ul class="sort">
  <li><a href="#" data-sort='default' class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}">Sort by default</a></li>
  <li><a href="#" data-sort='date' class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}">Sort by date</a></li>
  <li><a href="#" data-sort='rating' class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}">Sort by rating</a></li>
</ul>`;

export default class Sort extends AbstractElement {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortItemClickHandler = this._sortItemClickHandler.bind(this);
  }

  _sortItemClickHandler(evt) {
    evt.preventDefault();
    this._callback.sortItemClick(evt);
  }

  setSortItemClickHandler(callback) {
    this._callback.sortItemClick = callback;
    const sortItems = this.getElement().querySelectorAll('.sort__button');
    [...sortItems].forEach((item) => item.addEventListener('click', this._sortItemClickHandler));
  }

  getTemplate() {
    return getSort(this._currentSortType);
  }
}
