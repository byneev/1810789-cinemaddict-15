import dayjs from 'dayjs';
import { FilterType, UpdateType } from '../constants.js';
import { generateComment } from '../mock/comment-mock.js';
import { remove, replace } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import CommentView from '../view/comment.js';
import CommentsBlockView from '../view/comments-block.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import NewCommentView from '../view/new-comment.js';

export default class FilmPresenter {
  constructor(container, changeData, closeAllPopups, filmsModel, filterModel, commentModel, setPopupStatus) {
    this.isOpen = false;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentModel = commentModel;
    this._closeAllPopups = closeAllPopups;
    this._container = container;
    this.changeData = changeData;
    this.setPopupStatus = setPopupStatus;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._newCommentComponent = null;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._onEscapeKeydown = this._onEscapeKeydown.bind(this);
    this._handleCommentViewAction = this._handleCommentViewAction.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);
    this._handleNewCommentAction = this._handleNewCommentAction.bind(this);
    this._newCommentKeydownHandler = this._newCommentKeydownHandler.bind(this);
  }

  init(filmData) {
    this._film = filmData;
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
      this._closeAllPopups();
    }
  }

  _handleCommentViewAction(evt) {
    this._savedNewComment = this._newCommentComponent;
    const id = evt.target.dataset.id;
    this._commentModel.deleteComment(id);
  }

  _handleCommentModelEvent(event) {
    this._clearCommentsBlock();
    this._renderCommentsBlock();
    if (event) {
      this._newCommentComponent.updateData(this._savedNewComment.getData());
    }
    this._filmDetailsComponent.set;
    this._film.commentsList = this._commentModel.getComments();
    this._filmsModel.updateFilm(UpdateType.PATCH, this._film);
  }

  _newCommentKeydownHandler(evt) {
    let isCtrlPressed = false;
    let isEnterPressed = false;
    if (evt.ctrlKey) {
      isCtrlPressed = true;
    }
    if (evt.key === 'Enter') {
      isEnterPressed = true;
    }
    if (isCtrlPressed && isEnterPressed) {
      this._handleNewCommentAction();
    }
    if (evt.key === 'Escape') {
      this._closeAllPopups();
    }
  }

  _handleNewCommentAction() {
    this._savedNewComment = this._newCommentComponent;
    const newCommentData = {
      id: generateComment().id,
      author: 'Username',
      message: this._savedNewComment.getData().description,
      date: dayjs().toDate(),
      emotion: `/images/emoji/${this._savedNewComment.getData().emoji}.png`,
    };
    this._commentModel.addComment(newCommentData);
  }

  _clearCommentsBlock() {
    remove(this._commentsBlockComponent);
  }

  _renderCommentsBlock() {
    const popupContainer = this._filmDetailsComponent.getElement().querySelector('.film-details__inner');
    this._commentsBlockComponent = new CommentsBlockView(this._commentModel.getComments().length);
    render(popupContainer, this._commentsBlockComponent, RenderPosition.BEFOREEND);
    this.commentsContainer = this._commentsBlockComponent.getElement().querySelector('.film-details__comments-list');
    this._commentModel.getComments().forEach((comment) => {
      const commentComponent = new CommentView(comment);
      commentComponent.setCommentDeleteHandler(this._handleCommentViewAction);
      render(this.commentsContainer, commentComponent, RenderPosition.BEFOREEND);
    });
    this._newCommentComponent = new NewCommentView();
    render(this.commentsContainer, this._newCommentComponent, RenderPosition.AFTER);
    this._newCommentComponent.setAddCommentKeydownHandler(this._newCommentKeydownHandler);
    this._commentModel.addObserver(this._handleCommentModelEvent);
    document.body.addEventListener('keydown', this._onEscapeKeydown);
  }

  _renderPopup(film) {
    this.setPopupStatus(film, true);
    this._commentModel.setComments(film.commentsList);
    this._filmDetailsComponent = new FilmDetailsView(film);
    this._filmDetailsComponent.setCloseButtonClickHandler(this._closePopup);
    this._filmDetailsComponent.setFavoriteClickHandler(this._clickFavoriteHandler);
    this._filmDetailsComponent.setInWatchlistClickHandler(this._clickWatchlistHandler);
    this._filmDetailsComponent.setWatchedClickHandler(this._clickWatchedHandler);
    document.body.addEventListener('keydown', this._onEscapeKeydown);
    document.body.classList.add('hide-overflow');
    render(document.body, this._filmDetailsComponent, RenderPosition.BEFOREEND);
    this._renderCommentsBlock(false);
  }

  _closePopup() {
    this.setPopupStatus(this._film, false);
    remove(this._filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
  }

  _clickHandler() {
    this._closeAllPopups();
    this._renderPopup(this._film);
  }

  _clickFavoriteHandler() {
    const updateType = this._filterModel.getCurrentFilterType() === FilterType.FAVORITES ? UpdateType.MAJOR : UpdateType.MINOR;
    this.changeData(
      updateType,
      Object.assign({}, this._film, {
        userDetails: {
          isWatched: this._film.userDetails.isWatched,
          isFavorite: !this._film.userDetails.isFavorite,
          isInWatchlist: this._film.userDetails.isInWatchlist,
        },
      }),
      FilterType.FAVORITES,
      this._film.userDetails.isFavorite ? -1 : 1,
    );
  }

  _clickWatchlistHandler() {
    const updateType = this._filterModel.getCurrentFilterType() === FilterType.WATCHLIST ? UpdateType.MAJOR : UpdateType.MINOR;
    this.changeData(
      updateType,
      Object.assign({}, this._film, {
        userDetails: {
          isWatched: this._film.userDetails.isWatched,
          isFavorite: this._film.userDetails.isFavorite,
          isInWatchlist: !this._film.userDetails.isInWatchlist,
        },
      }),
      FilterType.WATCHLIST,
      this._film.userDetails.isInWatchlist ? -1 : 1,
    );
  }

  _clickWatchedHandler() {
    const updateType = this._filterModel.getCurrentFilterType() === FilterType.HISTORY ? UpdateType.MAJOR : UpdateType.MINOR;
    this.changeData(
      updateType,
      Object.assign({}, this._film, {
        userDetails: {
          isWatched: !this._film.userDetails.isWatched,
          isFavorite: this._film.userDetails.isFavorite,
          isInWatchlist: this._film.userDetails.isInWatchlist,
        },
      }),
      FilterType.HISTORY,
      this._film.userDetails.isWatched ? -1 : 1,
    );
  }
}
