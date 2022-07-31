/** A Proxy Class for Dispatching redux actions. */
export default class DispatcherService {
  _actions = {};

  constructor(store, reducers, LogService) {
    this._store = store;
    this._logger = LogService("DispatcherService -> ", "chocolate");
    this._logger.info("DispatcherService Constructor called");

    reducers.forEach((r) => {
      this._logger.info(`${Object.keys(r)[0]} action loaded`);

      this._actions[Object.keys(r)[0]] = function dispatch(payload) {
        this._store.dispatch(Object.values(r)[0](payload));
      }.bind(this);
    });
  }

  actionsDispatcher() {
    this._logger.info("actionsDispatcher called");
    return this._actions;
  }
}
