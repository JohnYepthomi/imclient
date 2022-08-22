import { Action, Store } from "@reduxjs/toolkit";
import { LogService, LogServiceInstance } from "./log.service";

export type CustomAction = (a: object) => void;

export type CustomActionObject = { [key: string]: CustomAction };

// export type CustomActionObject = {
//   newDirectMessage: CustomAction;
//   updateLastMessage: CustomAction;
//   updateDeliveredMessage: CustomAction;
//   updateSentMessage: CustomAction;
//   updateReaction: CustomAction;
//   removeReaction: CustomAction;
//   setGroupCreated: CustomAction;
//   newGroupMessage: CustomAction;
//   updateGroupSentMessage: CustomAction;
//   updateLastGroupMessage: CustomAction;
// };

/** A Proxy Class for Dispatching redux actions. */
export default class DispatcherService {
  public _store: Store;
  public _actions: CustomActionObject;
  public _logger: LogServiceInstance;

  constructor(store: Store, reducers: [], LogService: LogService) {
    this._store = store;
    this._logger = LogService("DispatcherService -> ", "chocolate");
    this._actions = {};

    reducers.forEach((r: Action) => {
      let key = Object.keys(r)[0]!;
      this._actions[key as "string"] = (payload: object) => {
        this._store.dispatch(Object.values(r)[0](payload));
      };
    });
  }

  // getStore() {
  //   return this._store;
  // }

  actionsDispatcher() {
    this._logger.info(`Dispatch Action Selector`);
    return this._actions;
  }
}
