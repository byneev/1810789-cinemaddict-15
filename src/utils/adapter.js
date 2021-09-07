export default class Adapter {
  static cLientToServerData(data, dataType) {
    const serverData = Object.assign({}, data, {});
    // удаляем ненужные свойства
    // TODO реализовать адаптер
    return serverData;
  }

  static serverToClientData(data, dataType) {
    const clientData = Object.assign({}, data, {});
    // удаляем ненужные свойства
    // TODO реализовать адаптер
    return clientData;
  }
}
