import { getProfile } from './view/profile.js';
import { getSiteMenu } from './view/site-menu.js';
import { getSort } from './view/sort.js';
import { getFilmsList, getFilmsListExtra } from './view/films-list.js';
import { getFilmCard } from './view/film-card.js';
import { getMoreBtn } from './view/more-btn.js';
import { generateFilm } from './mock/film-mock.js';
import { getFilmPopup } from './view/film-popup.js';
import { getCountByFilters } from './mock/filters-mock.js';

const addElement = (container, markup, place = 'beforeend') => {
  container.insertAdjacentHTML(place, markup);
};

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');

addElement(headerElement, getProfile());
addElement(mainElement, getSort());
addElement(mainElement, getFilmsList());

const filmsList = mainElement.querySelector('.films-list');
const filmListElement = filmsList.querySelector('.films-list__container');
// generate films array
const films = [];
for (let i = 0; i < 20; i++) {
  films.push(generateFilm());
}
// render first 5 films
const MAX_FILM_COUNT = 5;

for (let i = 0; i < Math.min(films.length, MAX_FILM_COUNT); i++) {
  addElement(filmListElement, getFilmCard(films[i]));
}
// add more btn if not all were shown
if (films.length > MAX_FILM_COUNT) {
  addElement(filmsList, getMoreBtn());
}
// add listener with click -> render addditional films
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

addElement(mainElement, getSiteMenu(getCountByFilters(films)), 'afterbegin');
// UNCOMMENT FOR POPUP
addElement(mainElement, getFilmPopup(films[0]));

addElement(filmsList, getFilmsListExtra('Most commented'), 'afterend');
addElement(filmsList, getFilmsListExtra('Top rated'), 'afterend');

const footerStatistics = document.querySelector('.footer__statistics');
addElement(footerStatistics, `<p>${films.length} movies inside</p>`);
