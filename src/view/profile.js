import { FAN_FILM_COUNT, NOVICE_FILM_COUNT } from '../constants.js';
import AbstractElement from './abstract-element.js';

const getProfile = (filmsCountByFilters) => {
  const { isWatched } = filmsCountByFilters;
  if (isWatched === 0) {
    return '<section class="header__profile profile"></section>';
  }
  let profileString;
  if (isWatched <= NOVICE_FILM_COUNT) {
    profileString = 'novice';
  } else if (isWatched > NOVICE_FILM_COUNT && isWatched <= FAN_FILM_COUNT) {
    profileString = 'fan';
  } else if (isWatched > FAN_FILM_COUNT) {
    profileString = 'movie buff';
  }
  return `<section class="header__profile profile">
  <p class="profile__rating">${profileString}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

export default class Profile extends AbstractElement {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return getProfile(this._filters);
  }
}
