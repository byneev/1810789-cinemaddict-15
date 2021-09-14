import { FAN_FILM_COUNT, NOVICE_FILM_COUNT } from '../constants.js';
import AbstractElement from './abstract-element.js';

const getProfileStatus = (idWatchedCount) => {
  let profileString;
  if (idWatchedCount <= NOVICE_FILM_COUNT) {
    profileString = 'novice';
  } else if (idWatchedCount > NOVICE_FILM_COUNT && idWatchedCount <= FAN_FILM_COUNT) {
    profileString = 'fan';
  } else if (idWatchedCount > FAN_FILM_COUNT) {
    profileString = 'movie buff';
  }
  return profileString;
};

const getProfile = (filmsCountByFilters) => {
  if (filmsCountByFilters.isWatched === 0) {
    return '<section class="header__profile profile"></section>';
  }
  const profileString = getProfileStatus(filmsCountByFilters.isWatched);

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

export { getProfileStatus };
