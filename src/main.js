import { getProfile } from './view/profile.js';
import { getSiteMenu } from './view/site-menu.js';
import { getSort } from './view/sort.js';
import { getFilmsList, getFilmsListExtra } from './view/films-list.js';
import { getFilmCard } from './view/film-card.js';
import { getMoreBtn } from './view/more-btn.js';
import { generateFilm } from './mock/film-mock.js';

const addElement = (container, markup, place = 'beforeend') => {
  container.insertAdjacentHTML(place, markup);
};

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

addElement(headerElement, getProfile());
addElement(mainElement, getSiteMenu());
addElement(mainElement, getSort());
addElement(mainElement, getFilmsList());

const filmsList = mainElement.querySelector('.films-list');
const filmListElement = filmsList.querySelector('.films-list__container');

const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}

const renderFilms = (count) => {
  for (const film of films) {
    addElement(filmListElement, getFilmCard(film));
    count--;
    if (count === 0) {
      break;
    }
  }
};

renderFilms(5);

addElement(filmsList, getMoreBtn());
addElement(filmsList, getFilmsListExtra('Most commented'), 'afterend');
addElement(filmsList, getFilmsListExtra('Top rated'), 'afterend');
