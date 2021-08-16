import { getCountByFilters } from '../mock/filters-mock.js';
import { createElement } from '../utils.js';

const getProfile = (films) => {
  const countByFilters = getCountByFilters(films);
  const { isWatchedCount } = countByFilters;
  if (isWatchedCount === 0) {
    return;
  }
  let profileString;
  if (isWatchedCount > 0 && isWatchedCount <= 10) {
    profileString = 'novice';
  } else if (isWatchedCount > 10 && isWatchedCount <= 20) {
    profileString = 'fan';
  } else if (isWatchedCount > 20) {
    profileString = 'movie buff';
  }
  return `<section class="header__profile profile">
  <p class="profile__rating">${profileString}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

export default class Profile {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return getProfile(this._films);
  }

  getElement() {
    if (!this._element) {
      return createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
