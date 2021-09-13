import { DataType, FilterType, UpdateType, ActionType } from '../constants.js';
import Adapter from '../utils/adapter.js';
import { remove, replace } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import CommentView from '../view/comment.js';
import CommentsBlockView from '../view/comments-block.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import NewCommentView from '../view/new-comment.js';

export default class FilmPresenter {
  constructor(container, changeData, closeAllPopups, filmsModel, filterModel, commentModel, api) {
    this.isOpen = false;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentModel = commentModel;
    this._container = container;
    this.changeData = changeData;
    this._api = api;
    this._commentsMap = new Map();
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._savedNewComment = null;
    this._newCommentComponent = null;
    this._closeAllPopups = closeAllPopups;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscapeKeydown = this._onEscapeKeydown.bind(this);
    this._handleCommentAction = this._handleCommentAction.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._newCommentKeydownHandler = this._newCommentKeydownHandler.bind(this);
  }

  init(filmData) {
    this._id = filmData.id;
    const oldFilmCard = this._filmCardComponent;
    this._filmCardComponent = new FilmCardView(filmData);
    this._filmCardComponent.setClickHandler(this._clickHandler);
    this._filmCardComponent.setFavoriteClickHandler(this._clickFavoriteHandler);
    this._filmCardComponent.setWatchlistClickHandler(this._clickWatchlistHandler);
    this._filmCardComponent.setWatchedClickHandler(this._clickWatchedHandler);

    if (oldFilmCard === null) {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this._filmCardComponent, oldFilmCard);
    remove(oldFilmCard);
  }

  _onEscapeKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._closePopup();
    }
  }

  resetElement(element) {
    return () =>
      element.updateData({
        isDisabling: false,
      });
  }

  _handleCommentAction(actionType, update = {}) {
    const resetComment = this.resetElement(this._commentsMap.get(update));
    const resetNewComment = this.resetElement(this._savedNewComment);

    switch (actionType) {
      case ActionType.ADD:
        if (!this._newCommentComponent.getData().description || !this._newCommentComponent.getData().emoji) {
          return;
        }
        this._savedNewComment = this._newCommentComponent;
        this._api
          .addComment(this._id, {
            comment: this._savedNewComment.getData().description,
            emotion: this._savedNewComment.getData().emoji,
          })
          .then((response) =>
            this._commentModel.setComments(
              response.comments.map((comment) => Adapter.serverToClientData(comment, DataType.COMMENT)),
              UpdateType.MINOR,
            ),
          )
          .catch(() => {
            this._savedNewComment.snake(resetNewComment);
          });
        break;
      case ActionType.DELETE:
        this._savedNewComment = this._newCommentComponent;
        this._api
          .deleteComment(update)
          .then(() => {
            this._commentModel.deleteComment(update, UpdateType.MINOR);
          })
          .catch(() => {
            this._commentsMap.get(update).snake(resetComment);
          });
        break;
    }
  }

  _commentDeleteHandler(evt) {
    this._handleCommentAction(ActionType.DELETE, evt.target.dataset.id);
  }

  _handleCommentModelEvent(data, updateType) {
    const presenter = this._commentModel.getPresenter();
    presenter._clearCommentsBlock();
    presenter._renderCommentsBlock(data);
    if (presenter._savedNewComment !== null) {
      presenter._newCommentComponent.updateData(presenter._savedNewComment.getData());
    }
    if (updateType === UpdateType.MINOR) {
      presenter._filmsModel.updateFilm(
        UpdateType.MINOR,
        Object.assign({}, presenter._filmsModel.getFilmById(presenter._id), {
          commentsList: data,
        }),
      );
    }
  }

  _newCommentKeydownHandler(evt) {
    if (evt.ctrlKey && evt.key === 'Enter') {
      this._handleCommentAction(ActionType.ADD);
    }
    if (evt.key === 'Escape') {
      this._closePopup();
    }
  }

  _clearCommentsBlock() {
    remove(this._commentsBlockComponent);
  }

  _renderCommentsBlock(filmComments) {
    const popupContainer = this._filmDetailsComponent.getElement().querySelector('.film-details__inner');
    this._commentsBlockComponent = new CommentsBlockView(filmComments.length);
    render(popupContainer, this._commentsBlockComponent, RenderPosition.BEFOREEND);
    this.commentsContainer = this._commentsBlockComponent.getElement().querySelector('.film-details__comments-list');
    filmComments.forEach((comment) => {
      const commentComponent = new CommentView(comment);
      this._commentsMap.set(comment.id, commentComponent);
      commentComponent.setCommentDeleteHandler(this._commentDeleteHandler);
      render(this.commentsContainer, commentComponent, RenderPosition.BEFOREEND);
    });
    this._newCommentComponent = new NewCommentView();
    render(this.commentsContainer, this._newCommentComponent, RenderPosition.AFTER);
    this._newCommentComponent.setAddCommentKeydownHandler(this._newCommentKeydownHandler);
    document.body.addEventListener('keydown', this._onEscapeKeydown);
  }

  _renderPopup(id) {
    this._closeAllPopups();
    this._commentModel.addObserver(this._handleCommentModelEvent);
    const film = this._filmsModel.getFilmById(id);
    this._id = id;
    this.isOpen = true;
    this._filmDetailsComponent = new FilmDetailsView(film);
    this._filmDetailsComponent.setCloseButtonClickHandler(this._closePopup);
    this._filmDetailsComponent.setFavoriteClickHandler(this._clickFavoriteHandler);
    this._filmDetailsComponent.setInWatchlistClickHandler(this._clickWatchlistHandler);
    this._filmDetailsComponent.setWatchedClickHandler(this._clickWatchedHandler);
    document.body.addEventListener('keydown', this._onEscapeKeydown);
    document.body.classList.add('hide-overflow');
    render(document.body, this._filmDetailsComponent, RenderPosition.BEFOREEND);
    this._api.getComments(this._id).then((comments) => {
      this._commentModel.setPresenter(this);
      this._commentModel.setComments(comments);
    });

    this._previousId = this._id;
  }

  _closePopup() {
    this.isOpen = false;
    remove(this._filmDetailsComponent);
    this._commentModel.removeObserver(this._handleCommentModelEvent);
    document.body.classList.remove('hide-overflow');
  }

  _clickHandler() {
    this._renderPopup(this._id);
  }

  _clickFavoriteHandler() {
    const film = this._filmsModel.getFilmById(this._id);
    const updateType = this._filterModel.getCurrentFilterType() === FilterType.FAVORITES ? UpdateType.MAJOR : UpdateType.MINOR;
    this.changeData(
      updateType,
      Object.assign({}, film, {
        userDetails: {
          isWatched: film.userDetails.isWatched,
          isFavorite: !film.userDetails.isFavorite,
          isInWatchlist: film.userDetails.isInWatchlist,
          watchingDate: film.userDetails.watchingDate,
        },
        commentsList: this._commentModel.getComments().map((comment) => comment.id),
      }),
      FilterType.FAVORITES,
      film.userDetails.isFavorite ? -1 : 1,
    );
  }

  _clickWatchlistHandler() {
    const film = this._filmsModel.getFilmById(this._id);
    const updateType = this._filterModel.getCurrentFilterType() === FilterType.WATCHLIST ? UpdateType.MAJOR : UpdateType.MINOR;
    this.changeData(
      updateType,
      Object.assign({}, film, {
        userDetails: {
          isWatched: film.userDetails.isWatched,
          isFavorite: film.userDetails.isFavorite,
          isInWatchlist: !film.userDetails.isInWatchlist,
          watchingDate: film.userDetails.watchingDate,
        },
        commentsList: this._commentModel.getComments().map((comment) => comment.id),
      }),
      FilterType.WATCHLIST,
      film.userDetails.isInWatchlist ? -1 : 1,
    );
  }

  _clickWatchedHandler() {
    const film = this._filmsModel.getFilmById(this._id);
    const updateType = this._filterModel.getCurrentFilterType() === FilterType.HISTORY ? UpdateType.MAJOR : UpdateType.MINOR;
    this.changeData(
      updateType,
      Object.assign({}, film, {
        userDetails: {
          isWatched: !film.userDetails.isWatched,
          isFavorite: film.userDetails.isFavorite,
          isInWatchlist: film.userDetails.isInWatchlist,
          watchingDate: film.userDetails.watchingDate,
        },
        commentsList: this._commentModel.getComments().map((comment) => comment.id),
      }),
      FilterType.HISTORY,
      film.userDetails.isWatched ? -1 : 1,
    );
  }

  _setScrollPopup(scrollTop) {
    this._filmDetailsComponent.getElement().scrollTop = scrollTop;
  }
}
