import { getProfile } from './view/profile.js';
import { getSiteMenu } from './view/site-menu.js';
import { getSort } from './view/sort.js';
import { getFilmsList, getFilmsListExtra } from './view/films-list.js';
import { getFilmCard } from './view/film-card.js';
import { getMoreButton } from './view/more-button.js';
import { generateFilm } from './mock/film-mock.js';
import { getFilmPopup } from './view/film-popup.js';
import { getFilmsAmount } from './view/films-amount.js';

const addElement = (container, markup, place = 'beforeend') => {
  container.insertAdjacentHTML(place, markup);
};

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

addElement(mainElement, getSort());
addElement(mainElement, getFilmsList());

const filmsList = mainElement.querySelector('.films-list');
const filmListElement = filmsList.querySelector('.films-list__container');
const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}
const MAX_FILM_COUNT = 5;

for (let i = 0; i < Math.min(films.length, MAX_FILM_COUNT); i++) {
  addElement(filmListElement, getFilmCard(films[i]));
}
addElement(headerElement, getProfile(films));
if (films.length > MAX_FILM_COUNT) {
  addElement(filmsList, getMoreButton());
}
const moreBtn = document.querySelector('.films-list__show-more');
let beginPoint = MAX_FILM_COUNT;
moreBtn.addEventListener('click', (evt) => {
  evt.preventDefault();
  films.slice(beginPoint, beginPoint + MAX_FILM_COUNT).forEach((film) => addElement(filmListElement, getFilmCard(film)));
  beginPoint += MAX_FILM_COUNT;
  if (beginPoint >= films.length) {
    moreBtn.remove();
  }
});

addElement(mainElement, getSiteMenu(films), 'afterbegin');
addElement(mainElement, getFilmPopup(films[0]));
addElement(filmsList, getFilmsListExtra('Most commented'), 'afterend');
addElement(filmsList, getFilmsListExtra('Top rated'), 'afterend');

const footerStatistics = document.querySelector('.footer__statistics');
addElement(footerStatistics, getFilmsAmount(films));
