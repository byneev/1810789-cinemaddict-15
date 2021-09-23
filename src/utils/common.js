import { SortType } from '../constants.js';
import AbstractElement from '../view/abstract-element';
import { ONE_MINUTE_MILLISECONDS, ONE_HOUR_MILLISECONDS, ONE_DAY_MILLISECONDS, ONE_WEEK_MILLISECONDS, ONE_MONTH_MILLISECONDS, ONE_YEAR_MILLISECONDS, DateUnit } from '../constants.js';
import dayjs from 'dayjs';

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
    case SortType.COMMENTS:
      return films.slice().sort((filmA, filmB) => filmB.commentsList.length - filmA.commentsList.length);
    case SortType.DEFAULT:
      return films;
  }
};

const checkEqualArrays = (arrayA, arrayB) => {
  const result = arrayA.filter((item) => !arrayB.includes(item));
  return result.length === 0;
};

const isOnline = () => window.navigator.onLine;

const getDateString = (dateGap, dateUnit) => (dateGap === 1 ? `${dateGap} ${dateUnit} ago` : `${dateGap} ${dateUnit}s ago`);

const formatDateByOld = (date) => {
  const nowDate = dayjs().toDate();
  const dateGap = nowDate - date;
  if (dateGap < ONE_MINUTE_MILLISECONDS) {
    return 'Now';
  }
  if (dateGap < ONE_HOUR_MILLISECONDS) {
    return getDateString(Math.floor(dateGap / ONE_MINUTE_MILLISECONDS), DateUnit.MINUTE);
  }
  if (dateGap < ONE_DAY_MILLISECONDS) {
    return getDateString(Math.floor(dateGap / ONE_HOUR_MILLISECONDS), DateUnit.HOUR);
  }
  if (dateGap < ONE_WEEK_MILLISECONDS) {
    return getDateString(Math.floor(dateGap / ONE_DAY_MILLISECONDS), DateUnit.DAY);
  }
  if (dateGap < ONE_MONTH_MILLISECONDS) {
    return getDateString(Math.floor(dateGap / ONE_WEEK_MILLISECONDS), DateUnit.WEEK);
  }
  if (dateGap < ONE_YEAR_MILLISECONDS) {
    return getDateString(Math.floor(dateGap / ONE_MONTH_MILLISECONDS), DateUnit.MONTH);
  }
  return dayjs(date).format('YYYY/MM/DD hh:mm');
};

export { createElement, remove, replace, updateArray, getCountByFilters, sortByType, isOnline, formatDateByOld, checkEqualArrays };
