import { DataType, DEFAULT_POPUP_SCROLL, FilterType, UpdateType } from '../constants.js';
import Adapter from '../utils/adapter.js';
import { remove, replace } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import CommentView from '../view/comment.js';
import CommentsBlockView from '../view/comments-block.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import NewCommentView from '../view/new-comment.js';

export default class FilmPresenter {
  constructor(container, changeData, closeAllPopups, filmsModel, filterModel, commentModel, setPopupStatus, api) {
    this.isOpen = false;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentModel = commentModel;
    this._closeAllPopups = closeAllPopups;
    this._container = container;
    this.changeData = changeData;
    this.setPopupStatus = setPopupStatus;
    this._api = api;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._savedNewComment = null;
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

  // TODO Реализовать изменение добавления в избранное etc в Popup

  _onEscapeKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._closeAllPopups();
    }
  }

  _handleCommentViewAction(evt) {
    this._savedNewComment = this._newCommentComponent;
    const id = evt.target.dataset.id;
    this._api.deleteComment(id).then(() => {
      this._commentModel.deleteComment(id);
    });
  }

  _handleCommentModelEvent() {
    this._clearCommentsBlock();
    this._renderCommentsBlock(this._commentModel.getComments());
    if (this._savedNewComment !== null) {
      this._newCommentComponent.updateData(this._savedNewComment.getData());
    }
    this._filmsModel.updateFilm(
      UpdateType.MINOR,
      Object.assign({}, this._filmsModel.getFilmById(this._id), {
        commentsList: this._commentModel.getComments(),
      })
    );
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
    this._api
      .addComment(this._id, {
        comment: this._savedNewComment.getData().description,
        emotion: this._savedNewComment.getData().emoji,
      })
      .then((response) => this._commentModel.setComments(response.comments.map((comment) => Adapter.serverToClientData(comment, DataType.COMMENT))));
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
      commentComponent.setCommentDeleteHandler(this._handleCommentViewAction);
      render(this.commentsContainer, commentComponent, RenderPosition.BEFOREEND);
    });
    this._newCommentComponent = new NewCommentView();
    render(this.commentsContainer, this._newCommentComponent, RenderPosition.AFTER);
    this._newCommentComponent.setAddCommentKeydownHandler(this._newCommentKeydownHandler);
    this._commentModel.addObserver(this._handleCommentModelEvent);
    document.body.addEventListener('keydown', this._onEscapeKeydown);
  }

  _renderPopup(id, currentScroll) {
    const film = this._filmsModel.getFilmById(id);
    this._id = id;
    this.setPopupStatus(film, true);
    this._filmDetailsComponent = new FilmDetailsView(film);
    this._filmDetailsComponent.setCloseButtonClickHandler(this._closePopup);
    this._filmDetailsComponent.setFavoriteClickHandler(this._clickFavoriteHandler);
    this._filmDetailsComponent.setInWatchlistClickHandler(this._clickWatchlistHandler);
    this._filmDetailsComponent.setWatchedClickHandler(this._clickWatchedHandler);
    document.body.addEventListener('keydown', this._onEscapeKeydown);
    document.body.classList.add('hide-overflow');
    render(document.body, this._filmDetailsComponent, RenderPosition.BEFOREEND);
    this._api.getComments(this._id).then((comments) => {
      this._commentModel.setComments(comments); // здесь зацикливаемся
      this._clearCommentsBlock();
      this._renderCommentsBlock(comments);
    });
    this._filmDetailsComponent.getElement().scrollTop = currentScroll;
  }

  _closePopup() {
    this.isOpen = false;
    remove(this._filmDetailsComponent);
    document.body.classList.remove('hide-overflow');
  }

  _clickHandler() {
    this._closeAllPopups();
    this._renderPopup(this._id, DEFAULT_POPUP_SCROLL);
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
      }),
      FilterType.FAVORITES,
      film.userDetails.isFavorite ? -1 : 1
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
      }),
      FilterType.WATCHLIST,
      film.userDetails.isInWatchlist ? -1 : 1
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
      }),
      FilterType.HISTORY,
      film.userDetails.isWatched ? -1 : 1
    );
  }
}
