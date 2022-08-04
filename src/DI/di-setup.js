import container from "./di-container";
import { LogService } from "../services/log.service";
import ConnectionService from "../services/connection.service";
import { client, xml } from "@xmpp/client";
import DispatcherService from "../services/dispatcher.service";
import {
  newDirectMessage,
  updateLastMessage,
  updateDeliveredMessage,
  updateSentMessage,
  updateReaction,
} from "../features/messageSlice";
import store from "../store/store";
import incomingStanzaHandler from "../stanza.service.modules/incoming.stanza.handler";
import StanzaService from "../services/stanza.service";
import SendQueue from "../stanza.service.modules/send.queue";
import XepModule from "../stanza.service.modules/xep.mods";
/**
 * @param {object} connectionInfo
 */

export default async function diSetup(connectionInfo) {
  window.xmlBuilder = xml;

  /** --------- PREPARING_STREAM_CONNECTION ---------- */
  let conn = client({
    service: connectionInfo.service,
    domain: connectionInfo.domain,
    username: connectionInfo.credential.username,
    password: connectionInfo.credential.password,
    resource: connectionInfo.resource,
  });

  /**-----------  LOGGER_SERVICE --------------------*/
  let logFactory = () => LogService;

  /**--------- CUSTOM_REDUX_DISPATCHER ---------- */
  let actionsList = [
    { newDirectMessage },
    { updateLastMessage },
    { updateDeliveredMessage },
    { updateSentMessage },
    { updateReaction },
  ];
  let dispatcher = new DispatcherService(store, actionsList, logFactory());

  /**--------- HANDLES_INCOMING_AND_OUTGOING_STANZAS ---------- */
  let stanzaService = new StanzaService(
    xml,
    logFactory(),
    dispatcher,
    incomingStanzaHandler
  );

  let sendQueueInstance = new SendQueue(
    ConnectionService,
    dispatcher,
    logFactory()
  );
  let xepModuleInstance = new XepModule(stanzaService, logFactory());

  stanzaService.attachMod(xepModuleInstance, sendQueueInstance);

  /**--------- CONNECTION_EVENT_HANDLERS ---------- */
  conn.on("stanza", (stanza) => {
    stanzaService.acceptStanza(stanza);
  });

  conn.on("status", (status) => {
    console.log(status);
    ConnectionService.setStatus(status);
  });

  conn.on("offline", () => {
    console.log("offline");
    conn.stop();
  });

  conn.on("online", () => {
    stanzaService.sendPresence();
    console.log("online");
  });

  conn.on("error", (error) => {
    console.log(error);
  });

  /**--------- START_CONNECTION_STREAM ---------- */
  await conn.start().catch(console.error);

  /**--------- INJECT_CONNECTION_OBJECT_TO_CONNECTION_SERVICE ---------- */
  ConnectionService.attachServices(conn, xml, logFactory());

  /**--------- EXPOSE_SERVICES_IN_A_CONTAINER ---------- */
  container.StanzaService = stanzaService;
  container.ConnectionService = ConnectionService;
  container.Dispatcher = dispatcher;
}
