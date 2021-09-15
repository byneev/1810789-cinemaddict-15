import Chart from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import { BAR_HEIGHT, TimeFilterType } from '../constants.js';
import { getProfileStatus } from './profile.js';
import Smart from './smart.js';

const getActualGenres = (films) => {
  const genresSet = new Set();
  films.forEach((film) =>
    film.genres.forEach((genre) => {
      if (!genresSet.has(genre)) {
        genresSet.add(genre);
      }
    })
  );
  return genresSet;
};

const getGenresCountMap = (films) => {
  const genresSet = getActualGenres(films);
  const genresCountMap = new Map();
  let count;
  genresSet.forEach((genre) => {
    count = 0;
    films.forEach((film) => {
      if (film.genres.includes(genre)) {
        count++;
      }
    });
    genresCountMap.set(count, genre);
  });
  console.log(genresCountMap);
  return genresCountMap;
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
      <p class="statistic__item-text">${filmsCount} <span class="statistic__item-description">movies</span></p>
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
    this._films = films.filter((film) => film.userDetails.watchingDate);
    this._watchedFilms = [];
    this._data = this._filmsToData(TimeFilterType.ALL);
    this._statsFilterClickHandler = this._statsFilterClickHandler.bind(this);
  }

  getData() {
    return this._data();
  }

  _statsFilterClickHandler(evt) {
    evt.preventDefault();
    const value = evt.target.value;
    const data = this._filmsToData(value);
    this.updateData(data);
    this.initStats();
    this.restoreHandlers();
  }

  setStatsFilterClickHandler() {
    [...this.getElement().querySelectorAll('.statistic__filters-input')].forEach((element) => element.addEventListener('click', this._statsFilterClickHandler));
  }

  restoreHandlers() {
    [...this.getElement().querySelectorAll('.statistic__filters-input')].forEach((element) => element.addEventListener('click', this._statsFilterClickHandler));
  }

  _getFilmsByTime(filter) {
    switch (filter) {
      case TimeFilterType.ALL:
        return this._films;
      case TimeFilterType.YEAR:
        return this._films.filter((film) => dayjs().diff(film.userDetails.watchingDate, 'year') <= 1);
      case TimeFilterType.MONTH:
        return this._films.filter((film) => dayjs().diff(film.userDetails.watchingDate, 'month') <= 1);
      case TimeFilterType.WEEK:
        return this._films.filter((film) => dayjs().diff(film.userDetails.watchingDate, 'week') <= 1);
      case TimeFilterType.TODAY:
        return this._films.filter((film) => dayjs().diff(film.userDetails.watchingDate, 'day') <= 1);
    }
  }

  _getEmptyStats(filter) {
    return {
      genresMap: null,
      genres: null,
      currentFilter: filter,
      filmsCount: 0,
      filmsTime: [0, 0],
      topGenre: 'none',
      profile: '',
    };
  }

  _filmsToData(filter) {
    const films = this._getFilmsByTime(filter);
    if (films.length === 0) {
      return this._getEmptyStats(filter);
    }
    this._watchedFilms = films.filter((film) => film.userDetails.isWatched);
    let result = 0;
    this._watchedFilms.forEach((film) => (result += film.runtime));
    const genresMap = getGenresCountMap(films);
    const topGenre = genresMap.get([...genresMap.keys()].sort()[[...genresMap.keys()].length - 1]);
    return {
      genresMap: genresMap,
      genres: genresMap.values(),
      currentFilter: filter,
      filmsCount: this._watchedFilms.length,
      filmsTime: [Math.floor(result / 60), result % 60],
      topGenre: topGenre,
      profile: getProfileStatus(this._watchedFilms.length),
    };
  }

  initStats() {
    if (this._watchedFilms.length === 0) {
      return;
    }
    const statisticChart = this.getElement().querySelector('.statistic__chart');
    statisticChart.style.height = `${BAR_HEIGHT * this._data.genresMap.length}px`;

    const myChart = new Chart(statisticChart, {
      plugins: [chartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: [...this._data.genresMap.values()],
        datasets: [
          {
            data: [...this._data.genresMap.keys()],
            backgroundColor: '#ffe800',
            hoverBackgroundColor: '#ffe800',
            anchor: 'start',
            barThickness: 40,
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: '#ffffff',
                padding: 100,
                fontSize: 20,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                display: false,
                beginAtZero: true,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }

  getTemplate() {
    return getStatistic(this._data);
  }
}
