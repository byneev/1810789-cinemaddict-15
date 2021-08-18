import dayjs from 'dayjs';
import { ACTORS, COUNTRIES, ORIGINAL_TITLES, PARAGRAPHS, POSTERS, PRODUCERS, WRITERS, GENRES } from '../constants.js';
import { generateValuesFromArray, getRandomFloat, getRandomInteger } from '../utils/common.js';
import { generateComment } from './comment-mock.js';

const generateDescription = () => {
  const tempArray = [PARAGRAPHS[getRandomInteger(0, PARAGRAPHS.length - 1)]];
  for (const paragraph of PARAGRAPHS) {
    if (getRandomInteger(1, 5) === 1) {
      tempArray.push(paragraph);
    }
  }
  return tempArray.slice(0, 5).join(' ');
};

const generateUserDetails = () => {
  const isWatched = Boolean(getRandomInteger());
  return {
    isWatched: isWatched,
    isInWatchlist: !isWatched,
    isFavorite: Boolean(getRandomInteger()),
    watchingDate: isWatched ? dayjs().add(-getRandomInteger(1, 1000), 'day').toDate() : null,
  };
};

const generateComments = () => {
  const resultArray = [];
  for (let i = 0; i < 5; i++) {
    resultArray.push(generateComment());
  }
  return resultArray.slice(0, getRandomInteger(0, 5));
};

let id = 0;
const generateFilm = () => {
  const filmPoster = `/images/posters/${POSTERS[getRandomInteger(0, POSTERS.length - 1)]}`;
  const filmTitleTemp = filmPoster
    .replace('/images/posters/', '')
    .replace(/.jpg|.png/, '')
    .split('-')
    .join(' ');
  const runtimesAll = getRandomInteger(20, 120);
  const runtimeHours = runtimesAll / 60;
  return {
    id: ++id,
    poster: filmPoster,
    title: filmTitleTemp[0].toUpperCase() + filmTitleTemp.slice(1),
    originalTitle: ORIGINAL_TITLES[getRandomInteger(0, ORIGINAL_TITLES.length - 1)],
    rating: getRandomFloat(),
    realiseDate: dayjs().add(-getRandomInteger(1, 90), 'year').toDate(),
    runtime: runtimeHours < 1 ? `${runtimesAll}m` : `${Math.floor(runtimeHours)}h ${runtimesAll % 60}m`,
    genres: generateValuesFromArray(GENRES),
    description: generateDescription(),
    producer: PRODUCERS[getRandomInteger(0, PRODUCERS.length - 1)],
    actors: generateValuesFromArray(ACTORS),
    writers: generateValuesFromArray(WRITERS),
    country: COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)],
    ageRating: getRandomInteger(0, 18),
    userDetails: generateUserDetails(),
    commentsList: generateComments(),
  };
};

export { generateFilm };
