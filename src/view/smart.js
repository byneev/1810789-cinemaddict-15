import AbstractElement from './abstract-element.js';

export default class Smart extends AbstractElement {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error('restoreHandlers should be implement');
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentNode;
    this.removeElement();
    parent.replaceChild(this.getElement(), prevElement);
    this.restoreHandlers();
  }

  updateData(update, justUpdateData) {
    if (!update) {
      return;
    }
    this._data = Object.assign({}, this._data, update);
    if (justUpdateData) {
      return;
    }
    this.updateElement();
  }
}
