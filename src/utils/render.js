const RenderPosition = {
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
};

const render = (container, component, place, element = null) => {
  let elem = component.getElement();
  if (element) {
    elem = element;
  }
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(elem);
      break;
    case RenderPosition.BEFOREEND:
      container.append(elem);
      break;
  }
};

const onCardClickHandler = (target, component, className, callback) => {
  console.log(target);
  const evtTarget = target.querySelector(className);
  console.log(evtTarget);
  evtTarget.addEventListener('click', (evt) => {
    console.log('I am her');
    evt.preventDefault();
    callback(component);
  });
};

const renderPopup = (component) => {
  const filmPopupElement = component.getElement();
  const closePopup = () => {
    document.body.removeChild(filmPopupElement);
    document.body.classList.remove('hide-overflow');
  };
  onCardClickHandler(filmPopupElement, component, '.film-details__close-btn', closePopup);

  const onEscapeHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closePopup();
    }
    evt.target.removeEventListener(evt.key, onEscapeHandler);
  };

  document.body.addEventListener('keydown', (evt) => onEscapeHandler(evt));
  document.body.classList.add('hide-overflow');
  document.body.appendChild(filmPopupElement);
};

const renderFilm = (filmList, component) => {
  //todo
  const element = component.getElement();
  render(filmList, component, RenderPosition.BEFOREEND, element);
  onCardClickHandler(element, component, '.film-card__title', renderPopup);
  onCardClickHandler(element, component, '.film-card__poster', renderPopup);
  onCardClickHandler(element, component, '.film-card__comments', renderPopup);
};

export { render, RenderPosition, renderPopup, renderFilm };
