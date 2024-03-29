import dayjs from 'dayjs';
import { DataType, FilterType, UpdateType, ActionType, ListType } from '../constants.js';
import Adapter from '../utils/adapter.js';
import { isOnline, remove, replace } from '../utils/common.js';
import { render, RenderPosition } from '../utils/render.js';
import { showToast } from '../utils/toast.js';
import CommentView from '../view/comment.js';
import CommentsBlockView from '../view/comments-block.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import NewCommentView from '../view/new-comment.js';

export default class FilmPresenter {
  constructor(changeData, closeAllPopups, filmsModel, filterModel, commentModel, api) {
    this.isOpen = false;
    this.isInCommentedList = false;
    this.isInRatedList = false;
    this.isInList = false;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._commentModel = commentModel;
    this._changeData = changeData;
    this._api = api;
    this._commentsMap = new Map();
    this._filmCardComponent = null;
    this._filmCardRatedComponent = null;
    this._filmCardCommentedComponent = null;
    this._filmDetailsComponent = null;
    this._savedNewComment = null;
    this._newCommentComponent = null;
    this._closeAllPopups = closeAllPopups;
    this._clickHandler = this._clickHandler.bind(this);
    this._clickFavoriteHandler = this._clickFavoriteHandler.bind(this);
    this._clickWatchlistHandler = this._clickWatchlistHandler.bind(this);
    this._clickWatchedHandler = this._clickWatchedHandler.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this._onEscapeKeydown = this._onEscapeKeydown.bind(this);
    this._handleCommentAction = this._handleCommentAction.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._newCommentKeydownHandler = this._newCommentKeydownHandler.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.setListeners = this.setListeners.bind(this);
    this._renderPopup = this._renderPopup.bind(this);
    this._renderCommentsBlock = this._renderCommentsBlock.bind(this);
    this._clearCommentsBlock = this._clearCommentsBlock.bind(this);
  }

  init(filmData, container, listType = ListType.DEFAULT) {
    this._id = filmData.id;
    let oldFilmCard;
    switch (listType) {
      case ListType.COMMENTED:
        if (filmData.commentsList.length === 0) {
          return;
        }
        oldFilmCard = this._filmCardCommentedComponent;
        this._filmCardCommentedComponent = new FilmCardView(filmData);
        if (!this.isInCommentedList) {
          render(container, this._filmCardCommentedComponent, RenderPosition.BEFOREEND);
          this.isInCommentedList = true;
          this.setListeners();
          return;
        }
        replace(this._filmCardCommentedComponent, oldFilmCard);
        break;
      case ListType.RATED:
        oldFilmCard = this._filmCardRatedComponent;
        this._filmCardRatedComponent = new FilmCardView(filmData);
        if (!this.isInRatedList) {
          render(container, this._filmCardRatedComponent, RenderPosition.BEFOREEND);
          this.isInRatedList = true;
          this.setListeners();
          return;
        }
        replace(this._filmCardRatedComponent, oldFilmCard);
        break;
      case ListType.DEFAULT:
        oldFilmCard = this._filmCardComponent;
        this._filmCardComponent = new FilmCardView(filmData);
        if (oldFilmCard === null) {
          render(container, this._filmCardComponent, RenderPosition.BEFOREEND);
          this.isInList = true;
          this.setListeners();
          return;
        }
        replace(this._filmCardComponent, oldFilmCard);
        break;
    }
  }

  removeListeners() {
    if (this._filmCardComponent !== null) {
      this._filmCardComponent.removeListeners();
    }
    if (this._filmCardRatedComponent !== null) {
      this._filmCardRatedComponent.removeListeners();
    }
    if (this._filmCardCommentedComponent !== null) {
      this._filmCardCommentedComponent.removeListeners();
    }
  }

  _setComponentListeners(component) {
    if (component === null) {
      return;
    }
    component.setClickHandler(this._clickHandler);
    component.setFavoriteClickHandler(this._clickFavoriteHandler);
    component.setWatchlistClickHandler(this._clickWatchlistHandler);
    component.setWatchedClickHandler(this._clickWatchedHandler);
  }

  setListeners() {
    this._setComponentListeners(this._filmCardComponent);
    this._setComponentListeners(this._filmCardRatedComponent);
    this._setComponentListeners(this._filmCardCommentedComponent);
  }

  _onEscapeKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.closePopup();
    }
  }

  _resetElement(element) {
    return () =>
      element.updateData({
        isDisabling: false,
      });
  }

  _handleCommentAction(actionType, update) {
    const resetComment = this._resetElement(this._commentsMap.get(update));
    const resetNewComment = this._resetElement(this._savedNewComment);

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
          .then((response) => {
            response.comments.map((comment) => Adapter.serverToClientData(comment, DataType.COMMENT));
            this._commentModel.setComments(
              response.comments.map((comment) => Adapter.serverToClientData(comment, DataType.COMMENT)),
              ActionType.ADD,
            );
          })
          .catch(() => {
            this._savedNewComment.snake(resetNewComment);
          });
        break;
      case ActionType.DELETE:
        this._savedNewComment = this._newCommentComponent;
        this._api
          .deleteComment(update)
          .then(() => {
            this._commentModel.deleteComment(update, ActionType.DELETE);
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

  _handleCommentModelEvent(data, actionType) {
    const presenter = this._commentModel.getPresenter();
    if (actionType === ActionType.PATCH) {
      presenter._clearCommentsBlock();
      presenter._renderCommentsBlock(data);
      presenter.setScrollPopup();
    }
    if (actionType === ActionType.DELETE || actionType === ActionType.ADD) {
      this._lastAction = actionType;
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
      if (!isOnline()) {
        showToast();
        return;
      }
      this._handleCommentAction(ActionType.ADD);
    }
    if (evt.key === 'Escape') {
      this.closePopup();
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
    if (this._savedNewComment !== null) {
      this._newCommentComponent = this._savedNewComment;
    }
    if (this._lastAction === ActionType.ADD || !this._lastAction) {
      this._newCommentComponent = new NewCommentView();
    }
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
    this._filmDetailsComponent.setCloseButtonClickHandler(this.closePopup);
    this._filmDetailsComponent.setFavoriteClickHandler(this._clickFavoriteHandler);
    this._filmDetailsComponent.setInWatchlistClickHandler(this._clickWatchlistHandler);
    this._filmDetailsComponent.setWatchedClickHandler(this._clickWatchedHandler);
    this._filmDetailsComponent.setChangeScrollHandler();
    document.body.addEventListener('keydown', this._onEscapeKeydown);
    document.body.classList.add('hide-overflow');
    render(document.body, this._filmDetailsComponent, RenderPosition.BEFOREEND);
    this._api.getComments(this._id).then((comments) => {
      this._commentModel.setPresenter(this);
      this._commentModel.setComments(comments);
    });
  }

  closePopup() {
    this.isOpen = false;
    remove(this._filmDetailsComponent);
    this._commentModel.removeObserver(this._handleCommentModelEvent);
    document.body.classList.remove('hide-overflow');
  }

  _clickHandler() {
    if (!isOnline()) {
      showToast();
      return;
    }
    this._renderPopup(this._id);
  }

  _clickFavoriteHandler() {
    const film = this._filmsModel.getFilmById(this._id);
    const updateType = this._filterModel.getCurrentFilterType() === FilterType.FAVORITES ? UpdateType.MAJOR : UpdateType.MINOR;
    this._changeData(
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
    this._changeData(
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
    this._changeData(
      updateType,
      Object.assign({}, film, {
        userDetails: {
          isWatched: !film.userDetails.isWatched,
          isFavorite: film.userDetails.isFavorite,
          isInWatchlist: film.userDetails.isInWatchlist,
          watchingDate: dayjs().toDate(),
        },
        commentsList: this._commentModel.getComments().map((comment) => comment.id),
      }),
      FilterType.HISTORY,
      film.userDetails.isWatched ? -1 : 1,
    );
  }

  setScrollPopup() {
    this._filmDetailsComponent.getElement().scrollTop = this._filmDetailsComponent.scroll;
  }
}
