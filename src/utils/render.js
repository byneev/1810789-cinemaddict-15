const RenderPosition = {
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
};

const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case RenderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

const onCardClickHandler = (data, target, className, callback) => {
  target.querySelector(className).addEventListener('click', (evt) => {
    evt.preventDefault();
    callback(data, evt.target);
  });
};

const renderPopup = (film, element, component) => {
  const filmPopupElement = new component(film).getElement();

  const closePopup = () => {
    document.body.removeChild(filmPopupElement);
    document.body.classList.remove('hide-overflow');
  };
  onCardClickHandler(film, filmPopupElement, '.film-details__close-btn', closePopup);

  const onEscapeHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closePopup();
    }
    evt.target.removeEventListener(evt.key, onEscapeHandler);
  };

  document.body.addEventListener('keydown', (evt) => onEscapeHandler(evt));
  document.body.classList.add('hide-overflow');
  document.body.appendChild(filmPopupElement);
  element.removeEventListener('click', renderPopup);
};

const renderFilm = (filmList, component) => {
  const filmCardElement = component.getElement();

  onCardClickHandler(film, filmCardElement, '.film-card__title', renderPopup);
  onCardClickHandler(film, filmCardElement, '.film-card__poster', renderPopup);
  onCardClickHandler(film, filmCardElement, '.film-card__comments', renderPopup);
  render(filmList, filmCardElement, RenderPosition.BEFOREEND);
};

export { render, RenderPosition, renderPopup, renderFilm };
