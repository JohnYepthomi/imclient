import container from "./di-container";
import initStanzaService from "../services/stanza.service";
import UserService from "../services/user.service";
import { LogService } from "../services/log.service";
import ClientService from "../services/client.service";
import { client, xml } from "@xmpp/client";
import DispatcherService from "../services/dispatcher.service";
import {
  newDirectMessage,
  updateLastMessage,
  updateDeliveredMessage,
  updateSentMessage,
} from "../features/messageSlice";
import store from "../store/store";

export default async function diSetup(userInfo) {
  let logServiceFactory = () => LogService;

  /* User Service */
  let userService = new UserService(userInfo, logServiceFactory());

  /* DispatcherService */
  let actionsList = [
    { newDirectMessage },
    { updateLastMessage },
    { updateDeliveredMessage },
    { updateSentMessage },
  ];
  let dispatcher = new DispatcherService(
    store,
    actionsList,
    logServiceFactory()
  );

  /* Client Service */
  ClientService.attachServices(
    client,
    userService,
    xml,
    dispatcher,
    logServiceFactory()
  );
  await ClientService.logIn();

  /* Stanza Service */
  let stanzaService = initStanzaService(
    ClientService,
    xml,
    logServiceFactory,
    dispatcher
  );

  /* Container Assignment */
  container.StanzaService = stanzaService;
  container.UserService = userService;
  container.ClientService = ClientService;
}
