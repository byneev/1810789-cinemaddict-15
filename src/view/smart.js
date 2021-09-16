import AbstractElement from './abstract-element.js';

export default class Smart extends AbstractElement {
  constructor() {
    super();
    this._data = {};
  }

  _restoreHandlers() {
    throw new Error('restoreHandlers should be implement');
  }

  _updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentNode;
    this.removeElement();
    const newChild = this.getElement();
    parent.replaceChild(newChild, prevElement);
    this._restoreHandlers();
  }

  updateData(update, justUpdateData) {
    if (!update) {
      return;
    }
    this._data = Object.assign({}, this._data, update);
    if (justUpdateData) {
      return;
    }
    this._updateElement();
  }
}
