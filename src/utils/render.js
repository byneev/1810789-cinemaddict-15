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

export { render, RenderPosition };
