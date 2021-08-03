import { getProfile } from './view/profile.js';
import { getSiteMenu } from './view/site-menu.js';
import { getSort } from './view/sort.js';
import { getFilmsList, getFilmsListExtra } from './view/films-list.js';
import { getFilmCards } from './view/film-card.js';
import { getMoreBtn } from './view/more-btn.js';
import { getFilmsAmount } from './view/films-amount.js';
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

addElement(filmListElement, getFilmCards(5));
addElement(filmsList, getMoreBtn());
addElement(filmsList, getFilmsListExtra('Most commented'), 'afterend');
addElement(filmsList, getFilmsListExtra('Top rated'), 'afterend');

const extraFilmLists = mainElement.querySelectorAll('.films-list--extra');

[...extraFilmLists].forEach((element) => {
  const filmListContainer = element.querySelector('.films-list__container');
  addElement(filmListContainer, getFilmCards(2));
});

const footerStatWrapper = document.querySelector('.footer__statistics');

addElement(footerStatWrapper, getFilmsAmount());

console.log(generateFilm());
