import { SortType } from '../constants.js';
import AbstractElement from '../view/abstract-element';

const getRandomInteger = (start = 0, end = 1) => Math.floor(start + Math.random() * (end - start + 1));

const getRandomFloat = (start = 4, end = 10, count = 1) => (start + Math.random() * (end - start)).toFixed(count);

const generateValuesFromArray = (array) => array.sort(() => Math.random() - Math.random()).slice(0, Math.floor(getRandomInteger(1, array.length / 3)));

const createElement = (template) => {
  const temp = document.createElement('div');
  temp.innerHTML = template;
  return temp.firstChild;
};

const remove = (component) => {
  if (!component) {
    return;
  }
  component.getElement().remove();
  component.removeElement();
};

const replace = (newChild, oldChild) => {
  if (newChild instanceof AbstractElement) {
    newChild = newChild.getElement();
  }
  if (oldChild instanceof AbstractElement) {
    oldChild = oldChild.getElement();
  }
  const parent = oldChild.parentElement;
  parent.replaceChild(newChild, oldChild);
};

const updateArray = (array, updatedItem) => array.map((item) => (item.id === updatedItem.id ? updatedItem : item));

const getCountByFilters = (films) => ({
  isWatched: [...films].filter((film) => film.userDetails.isWatched).length,
  isInWatchlist: [...films].filter((film) => film.userDetails.isInWatchlist).length,
  isFavorite: [...films].filter((film) => film.userDetails.isFavorite).length,
});

const sortByType = (films, sortType) => {
  switch (sortType) {
    case SortType.DATE:
      return films.slice().sort((filmA, filmB) => filmB.realiseDate - filmA.realiseDate);
    case SortType.RATING:
      return films.slice().sort((filmA, filmB) => filmB.rating - filmA.rating);
    case SortType.DEFAULT:
      return films;
  }
};

const isOnline = () => window.navigator.onLine;

export { getRandomInteger, getRandomFloat, generateValuesFromArray, createElement, remove, replace, updateArray, getCountByFilters, sortByType, isOnline };
