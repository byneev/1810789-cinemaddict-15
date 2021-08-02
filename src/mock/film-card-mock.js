import { POSTERS } from '../constants.js';
import { getRandomInteger } from '../utils.js';

const generateFilmPoster = () => `/images/${POSTERS[getRandomInteger(0, POSTERS.length - 1)]}`;

const generateFilmCard = () => {
  const filmPoster = generateFilmPoster();
  const filmTitleTemp = filmPoster.replace('/images/', '').replace('.jpg', '').split('-').join(' ');
  const filmTitle = filmTitleTemp[0].toUpperCase() + filmTitleTemp.slice(1);
  const filmCard = {
    poster: filmPoster,
    title: filmTitle,
  };

  return filmCard;
};

export { generateFilmCard };
