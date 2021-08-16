import { getCountByFilters } from '../mock/filters-mock.js';
import AbstractElement from './abstract-element.js';

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

export default class Profile extends AbstractElement {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return getProfile(this._films);
  }
}
