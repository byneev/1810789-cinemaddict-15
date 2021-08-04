import dayjs from 'dayjs';
import { ACTORS, COUNTRIES, ORIGINAL_TITLES, PARAGRAPHS, POSTERS, PRODUCERS, WRITERS, GENRES } from '../constants.js';
import { generateId, generateValuesFromArray, getRandomFloat, getRandomInteger } from '../utils.js';
import { generateComment } from './comment-mock.js';

const generateFilmPoster = () => `/images/posters/${POSTERS[getRandomInteger(0, POSTERS.length - 1)]}`;

const generateTitleByPoster = (poster) => {
  const filmTitleTemp = poster
    .replace('/images/posters/', '')
    .replace(/.jpg|.png/, '')
    .split('-')
    .join(' ');
  return filmTitleTemp[0].toUpperCase() + filmTitleTemp.slice(1);
};

const generateOriginalTitle = () => ORIGINAL_TITLES[getRandomInteger(0, ORIGINAL_TITLES.length - 1)];

const generateReleaseYear = () => dayjs().add(-getRandomInteger(1, 90), 'year').toDate();

const generateRuntime = () => {
  const runtimesAll = getRandomInteger(0, 120);
  const runtimeHours = runtimesAll / 60;
  return runtimeHours < 1 ? `${runtimesAll}m` : `${Math.floor(runtimeHours)}h ${runtimesAll % 60}m`;
};

const generateDescription = () => {
  const tempArray = [PARAGRAPHS[getRandomInteger(0, PARAGRAPHS.length - 1)]];
  for (const paragraph of PARAGRAPHS) {
    if (getRandomInteger(1, 5) === 1) {
      tempArray.push(paragraph);
    }
  }
  return tempArray.slice(0, 5).join(' ');
};

const generateProducer = () => PRODUCERS[getRandomInteger(0, PRODUCERS.length - 1)];

const generateCountry = () => COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)];

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

const generateFilm = () => {
  const filmPoster = generateFilmPoster();

  return {
    id: generateId(),
    poster: filmPoster,
    title: generateTitleByPoster(filmPoster),
    originalTitle: generateOriginalTitle(),
    rating: getRandomFloat(),
    realiseDate: generateReleaseYear(),
    runtime: generateRuntime(),
    genres: generateValuesFromArray(GENRES),
    description: generateDescription(),
    producer: generateProducer(),
    actors: generateValuesFromArray(ACTORS),
    writers: generateValuesFromArray(WRITERS),
    country: generateCountry(),
    ageRating: getRandomInteger(0, 18),
    userDetails: generateUserDetails(),
    commentsList: generateComments(),
  };
};

export { generateFilm };
