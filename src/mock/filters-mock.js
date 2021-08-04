const getCountByFilters = (films) => {
  const countByFilters = {
    isWatched: 0,
    isInWatchlist: 0,
    isFavorite: 0,
  };

  films.forEach((film) => {
    const { userDetails } = film;
    if (userDetails.isWatched) {
      countByFilters.isWatched++;
    }
    if (userDetails.isInWatchlist) {
      countByFilters.isInWatchlist++;
    }
    if (userDetails.isFavorite) {
      countByFilters.isFavorite++;
    }
  });

  return countByFilters;
};

export { getCountByFilters };
