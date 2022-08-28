export default class DispatcherService {
    constructor(store, reducers, LogService) {
        this._store = store;
        this._logger = LogService("DispatcherService -> ", "chocolate");
        this._actions = {};
        reducers.forEach((r) => {
            let key = Object.keys(r)[0];
            this._actions[key] = (payload) => {
                this._store.dispatch(Object.values(r)[0](payload));
            };
        });
    }
    actionsDispatcher() {
        this._logger.info(`Dispatch Action Selector`);
        return this._actions;
    }
}
