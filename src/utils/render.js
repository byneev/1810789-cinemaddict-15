import AbstractElement from '../view/abstract-element.js';

const RenderPosition = {
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTER: 'after',
  BEFORE: 'before',
};

const render = (container, child, place) => {
  if (container instanceof AbstractElement) {
    container = container.getElement();
  }
  if (child instanceof AbstractElement) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTER:
      container.after(child);
      break;
    case RenderPosition.BEFORE:
      container.before(child);
      break;
  }
};

const renderPopup = (component) => {
  const closePopup = () => {
    document.body.removeChild(component.getElement());
    document.body.classList.remove('hide-overflow');
    component.getElement().querySelector('.film-details__close-btn').removeEventListener('click', closePopup);
  };
  const onEscapeKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      closePopup();
    }
    document.body.removeEventListener('keydown', onEscapeKeydown);
  };

  component.getElement().querySelector('.film-details__close-btn').addEventListener('click', closePopup);
  document.body.addEventListener('keydown', onEscapeKeydown);
  document.body.classList.add('hide-overflow');
  document.body.appendChild(component.getElement());
};

export { render, RenderPosition, renderPopup };
