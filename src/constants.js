export const DEFAULT_POPUP_SCROLL = 0;
export const ONE_DAY_SECONDS = 84600;
export const ONE_SECOND_MILLISECONDS = 1000;
export const SNAKE_ANIMATION_TIMEOUT = 600;
export const NOVICE_FILM_COUNT = 10;
export const FAN_FILM_COUNT = 20;
export const BAR_HEIGHT = 50;
export const MAX_FILMS_COUNT = 5;

export const EMOJIES = ['smile', 'sleeping', 'puke', 'angry'];

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'isInWatchlist',
  HISTORY: 'isWatched',
  FAVORITES: 'isFavorite',
  NONE: 'none',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UpdateType = {
  MINOR: 'minor',
  MAJOR: 'major',
  PATCH: 'patch',
  INIT: 'init',
};

export const MethodType = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const DataType = {
  FILM: 'film',
  COMMENT: 'comment',
};

export const ActionType = {
  ADD: 'add',
  DELETE: 'delete',
  PATCH: 'patch',
};

export const TimeFilterType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};
