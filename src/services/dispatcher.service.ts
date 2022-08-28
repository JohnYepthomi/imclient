import { Action, Store } from "@reduxjs/toolkit";
import { LogServiceType, LoggerObjectType, CustomActionObject, DispatcherServiceType } from "./service.types";



export default class DispatcherService implements DispatcherServiceType{
  public _store: Store;
  public _actions: CustomActionObject;
  public _logger: LoggerObjectType;

  constructor(store: Store, reducers: [], LogService: LogServiceType) {
    this._store = store;
    this._logger = LogService("DispatcherService -> ", "chocolate");
    this._actions = {};

    reducers.forEach((r: Action) => {
      let key = Object.keys(r)[0]!;
      this._actions[key as "string"] = (payload: object|boolean) => {
        this._store.dispatch(Object.values(r)[0](payload));
      };
    });
  }

  actionsDispatcher() {
    this._logger.info(`Dispatch Action Selector`);
    return this._actions;
  }
}
