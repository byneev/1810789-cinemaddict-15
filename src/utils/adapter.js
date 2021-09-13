/* eslint-disable camelcase */
import dayjs from 'dayjs';
import { DataType } from '../constants.js';

const getClientDataTemplate = () => ({
  id: null,
  poster: null,
  title: null,
  originalTitle: null,
  rating: null,
  realiseDate: null,
  runtime: null,
  genres: null,
  description: null,
  producer: null,
  actors: null,
  writers: null,
  country: null,
  ageRating: null,
  userDetails: null,
  commentsList: null,
});

const getServerDataTemplate = () => ({
  id: null,
  film_info: null,
  user_details: null,
  comments: null,
});

export default class Adapter {
  static cLientToServerData(data, dataType) {
    let newData;
    switch (dataType) {
      case DataType.FILM:
        newData = Object.assign({}, getServerDataTemplate(), {
          id: data.id,
          film_info: {
            title: data.title,
            alternative_title: data.originalTitle,
            total_rating: data.rating,
            poster: data.poster,
            age_rating: data.ageRating,
            director: data.producer,
            writers: data.writers,
            actors: data.actors,
            release: {
              date: dayjs(data.realiseDate).toISOString(),
              release_country: data.country,
            },
            runtime: data.runtime,
            genre: data.genres,
            description: data.description,
          },
          user_details: {
            favorite: data.userDetails.isFavorite,
            already_watched: data.userDetails.isWatched,
            watchlist: data.userDetails.isInWatchlist,
            watching_date: data.userDetails.isWatched ? dayjs(data.userDetails.watchingDate).toISOString() : null,
          },
          comments: data.commentsList,
        });
        return newData;
      case DataType.COMMENT:
        newData = Object.assign({}, data, {
          date: dayjs(data.date).toISOString(),
        });
        return newData;
    }
  }

  static serverToClientData(data, dataType) {
    let newData;
    switch (dataType) {
      case DataType.FILM:
        newData = Object.assign({}, getClientDataTemplate(), {
          id: data.id,
          actors: data.film_info.actors,
          ageRating: data.film_info.age_rating,
          commentsList: data.comments,
          country: data.film_info.release.release_country,
          description: data.film_info.description,
          genres: data.film_info.genre,
          originalTitle: data.film_info.alternative_title,
          poster: data.film_info.poster,
          producer: data.film_info.director,
          rating: data.film_info.total_rating,
          realiseDate: new Date(data.film_info.release.date),
          runtime: data.film_info.runtime,
          title: data.film_info.title,
          userDetails: {
            isFavorite: data.user_details.favorite,
            isWatched: data.user_details.already_watched,
            isInWatchlist: data.user_details.watchlist,
            watchingDate: new Date(data.user_details.watching_date),
          },
          writers: data.film_info.writers,
        });
        return newData;
      case DataType.COMMENT:
        newData = Object.assign({}, data, {
          message: data.comment,
          date: new Date(data.date),
        });
        return newData;
    }
  }
}
