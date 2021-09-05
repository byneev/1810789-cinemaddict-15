import { FilterType } from '../constants.js';
import AbstractObserver from '../utils/abstract-observer.js';

export default class SiteMenu extends AbstractObserver {
  constructor() {
    super();
    this._filters = {};
    this._currentFilterType = FilterType.ALL;
  }

  setFilters(filters) {
    this._filters = filters;
  }

  updateFilters(filterType, change) {
    this._filters[filterType] = this._filters[filterType] + change;
  }

  getFilters() {
    return this._filters;
  }

  getCurrentFilterType() {
    return this._currentFilterType;
  }

  setCurrentFilterType(filterType) {
    this._currentFilterType = filterType;
    this._notify(this._currentFilterType);
  }
}
