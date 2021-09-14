import dayjs from 'dayjs';
import { TimeFilterType } from '../constants.js';
import { getProfileStatus } from './profile.js';
import Smart from './smart.js';

const getTopMatchingElement = (films) => {
  const genresSet = new Set();
  films.forEach((film) =>
    film.genres.forEach((genre) => {
      if (!genresSet.has(genre)) {
        genresSet.add(genre);
      }
    })
  );
  let genresCount = {
    count: 0,
    genre: '',
  };
  let count;
  genresSet.forEach((genre) => {
    count = 0;
    films.forEach((film) => {
      if (film.genres.includes(genre)) {
        count++;
      }
    });
    if (count > genresCount.count) {
      genresCount = {
        count: count,
        genre: genre,
      };
    }
  });
  return genresCount.genre;
};

const getStatistic = (data) => {
  const { currentFilter, filmsCount, filmsTime, topGenre, profile } = data;
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${profile}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentFilter === TimeFilterType.ALL ? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentFilter === TimeFilterType.TODAY ? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentFilter === TimeFilterType.WEEK ? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentFilter === TimeFilterType.MONTH ? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentFilter === TimeFilterType.YEAR ? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${filmsCount}22 <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${filmsTime[0]}<span class="statistic__item-description">h</span> ${filmsTime[1]} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Statistic extends Smart {
  constructor(films) {
    super();
    this._films = films;
    this._currentFilter = TimeFilterType.ALL;
    this._profile = getProfileStatus(this._films.filter((film) => film.userDetails.isWatched).length);
    this._data = this._filmsToData();
  }

  _getFilmsByTime(filter) {
    switch (filter) {
      case TimeFilterType.ALL:
        return this._films;
      case TimeFilterType.YEAR:
        return this._films.filter((film) => dayjs().toDate() - film.userDetails.watchingDate < 365);
      case TimeFilterType.MONTH:
        return this._films;
      case TimeFilterType.WEEK:
        return this._films;
      case TimeFilterType.TODAY:
        return this._films;
    }
  }

  _filmsToData() {
    const films = this._getFilmsByTime(this._currentFilter);
    let result = 0;
    films.forEach((film) => (result += film.runtime));

    return {
      currentFilter: this._currentFIlter,
      filmsCount: films.length,
      filmsTime: [Math.floor(result / 60), result % 60],
      topGenre: getTopMatchingElement(films),
      profile: this._profile,
      // клик на определенный фильтр меняет currentFilter и вызывает UpdateData(this._filmsToData)
      // а клики на определенные кнопки будут изменять данные this._data
    };
  }

  getTemplate() {
    return getStatistic(this._data);
  }
}
