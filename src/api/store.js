export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storageKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storageKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(this._storageKey, JSON.stringify(items));
  }

  setItem(key, value) {
    const store = JSON.parse(this._storage.getItem(this._storageKey));
    this._storage.setItem(
      this._storageKey,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        })
      )
    );
  }

  removeItem(key) {
    const store = JSON.parse(this._storage.getItem(this._storageKey));
    delete store[key];

    this._storage.setItem(this._storageKey, JSON.stringify(store));
  }
}
