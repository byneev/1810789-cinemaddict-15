import dayjs from 'dayjs';
import { ACTORS, COUNTRIES, ORIGINAL_TITLES, PARAGRAPHS, POSTERS, PRODUCERS } from '../constants.js';
import { GENRES } from '../constants.js';
import { getRandomFloat, getRandomInteger } from '../utils.js';

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

const generateReleaseYear = () => dayjs().add(-90, 'year').toDate();

const generateRuntime = () => {
  const runtimesAll = getRandomInteger(0, 120);
  const runtimeHours = runtimesAll / 60;
  return runtimeHours < 1 ? `${runtimesAll}m` : `${Math.floor(runtimeHours)}h ${runtimesAll % 60}m`;
};

const generateGenres = () => {
  const resultArray = [];
  for (const genre of GENRES) {
    if (getRandomInteger(1, 9) === 1) {
      resultArray.push(genre);
    }
  }
  if (resultArray.length === 0) {
    resultArray.push(GENRES[getRandomInteger(0, GENRES.length - 1)]);
  }
  return resultArray;
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

const generateActors = () => {
  const resultArray = [];
  for (const actor of ACTORS) {
    if (getRandomInteger(1, 4) === 1) {
      resultArray.push(actor);
    }
  }
  if (resultArray.length === 0) {
    resultArray.push(ACTORS[getRandomInteger(0, ACTORS.length - 1)]);
  }
  return resultArray;
};

const generateCountry = () => COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)];

const generateCommentsId = () => {
  const resultArray = [];
  for (let i = 1; i < 20; i++) {
    if (getRandomInteger(1, 5) === 1) {
      resultArray.push(i);
    }
  }
  return resultArray.slice(0, 5);
};

const generateFilm = () => {
  const filmPoster = generateFilmPoster();

  return {
    poster: filmPoster,
    title: generateTitleByPoster(filmPoster),
    originalTitle: generateOriginalTitle(),
    rating: getRandomFloat(),
    realiseDate: generateReleaseYear(),
    runtime: generateRuntime(),
    genre: generateGenres(),
    description: generateDescription(),
    producer: generateProducer(),
    actors: generateActors(),
    country: generateCountry(),
    ageRating: getRandomInteger(0, 21),
    isWatched: Boolean(getRandomInteger()),
    isFavorite: Boolean(getRandomInteger()),
    isInWatchlist: Boolean(getRandomInteger()),
    comments: generateCommentsId(),
  };
};

export { generateFilm };
