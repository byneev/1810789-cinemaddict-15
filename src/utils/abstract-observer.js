export default class AbstractObserver {
  constructor() {
    if (new.target === AbstractObserver) {
      throw new Error('You cant instantinate abstract class');
    }
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
