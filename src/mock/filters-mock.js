const getCountByFilters = (films) => {
  const countByFilters = {
    isWatchedCount: films.filter((film) => film.userDetails.isWatched).length,
    isInWatchlistCount: films.filter((film) => film.userDetails.isInWatchlist).length,
    isFavoriteCount: films.filter((film) => film.userDetails.isFavorite).length,
  };

  return countByFilters;
};

export { getCountByFilters };
