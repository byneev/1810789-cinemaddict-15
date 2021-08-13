const getCountByFilters = (films) => ({
  isWatchedCount: films.filter((film) => film.userDetails.isWatched).length,
  isInWatchlistCount: films.filter((film) => film.userDetails.isInWatchlist).length,
  isFavoriteCount: films.filter((film) => film.userDetails.isFavorite).length,
});

export { getCountByFilters };
