/** A Proxy Class for Dispatching redux actions. */

export default class DispatcherService {
  _store;
  _actions = {};

  constructor(store, reducers, LogService) {
    this._store = store;
    this._logger = LogService("DispatcherService -> ", "chocolate");

    reducers.forEach((r) => {
      this._actions[Object.keys(r)[0]] = function dispatch(payload) {
        this._store.dispatch(Object.values(r)[0](payload));
      }.bind(this);
    });
  }

  getStore() {
    return this._store;
  }

  actionsDispatcher() {
    return this._actions;
  }
}
