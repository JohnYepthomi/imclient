import { Store } from "@reduxjs/toolkit";
import DispatcherService from "./dispatcher.service";
import { LogService, LogServiceInstance } from "./log.service";
import xml from "@xmpp/xml";
import { Node, Element as stanzaElem } from "@xmpp/xml";

type xmlResolver = (a: stanzaElem) => void;

/* This type is temprary, rather export the type from the actual fucntion definition. Not sure  */
type StanzaHandler = (a: stanzaElem) => {
  bind: (a: StanzaService) => StanzaHandler;
  iqHandler: xmlResolver;
  ackResolver: xmlResolver;
  routeStanza: xmlResolver;
  chatResolver: xmlResolver;
  messageHandler: xmlResolver;
  presenceHandler: xmlResolver;
  groupChatResolver: xmlResolver;
  reactionsResolver: xmlResolver;
  instantMucResovler: xmlResolver;
  directInvitationResolver: xmlResolver;
};

type SendQueue = {
  add: (payload: stanzaElem) => void;
};

type xmlType = typeof xml;

// type outgoingChat = {
//   id: string;
//   from: string;
//   body: string;
//   timestamp: string;
//   sender: string;
//   delivered: boolean;
//   sent: boolean;
// };

// type outgoingGroupChat = {
//   id: string;
//   from: string;
//   body: string;
//   timestamp: string;
//   sender: string;
//   delivered: boolean;
//   sent: boolean;
// };

export default class StanzaService {
  public _xml: xmlType;
  public _dispatcher: DispatcherService;
  public _incomingStanzaHandler: StanzaHandler;
  public _store: Store;
  public _logger: LogServiceInstance;
  public _xepModule: object;
  public _sendQueue: SendQueue;

  constructor(
    XmlBuilder: xmlType,
    LogService: LogService,
    DispatcherService: DispatcherService,
    stanzaHandler: StanzaHandler,
    store: Store
  ) {
    this._xml = XmlBuilder;
    this._logger = LogService("StanzaService -> ", "orange");
    this._dispatcher = DispatcherService;
    this._incomingStanzaHandler = stanzaHandler.bind(this);
    this._store = store;
    this._xepModule = {};
    this._sendQueue = { add: () => {} };
  }

  attachMod(XepMod: object, SendQueue: SendQueue) {
    this._xepModule = XepMod;
    this._sendQueue = SendQueue;
  }

  async sendPresence(type: string) {
    let stanza = this._xml(
      "presence",
      type && type === "unavailable" ? { type: "unavailable" } : ""
    );
    this.send(stanza);
  }

  async sendChat({ jid, body }: { jid: string; body: string }) {
    let id = this.generateId(5);
    let timestamp = this.getTimestamp();

    let m = {
      id,
      from: "self",
      body,
      timestamp,
      sender: jid,
      delivered: false,
      sent: false,
    };

    this._dispatcher.actionsDispatcher().newDirectMessage?.(m);
    this._dispatcher.actionsDispatcher().updateLastMessage?.(m);

    let stanza = this._xml(
      "message",
      { type: "chat", to: jid, id },
      this._xml("body", {}, body)
    );

    stanza.c("request", { xmlns: "urn:xmpp:receipts" });
    await this.send(stanza);
  }

  async sendGroupChat({
    gid,
    body,
    groupName,
  }: {
    gid: string;
    body: string;
    groupName: string;
  }) {
    let id = this.generateId(5);
    let timestamp = this.getTimestamp();
    let m = {
      id,
      gid,
      groupName,
      from: "self",
      body,
      timestamp,
      delivered: false,
      sent: false,
    };

    if (gid.includes("/")) {
      gid = gid.split("/")[0]!;
    }

    this._dispatcher.actionsDispatcher().newGroupMessage?.(m);
    this._dispatcher.actionsDispatcher().updateLastMessage?.(m);

    let stanza = this._xml(
      "message",
      { type: "groupchat", to: gid, id },
      this._xml("body", {}, body)
    );
    console.log({ gid });

    stanza.c("request", { xmlns: "urn:xmpp:receipts" });
    await this.send(stanza);
  }

  async sendReaction({
    reactionId,
    reactedby,
    senderjid,
    emoji,
  }: {
    reactionId: string;
    reactedby: string;
    senderjid: string;
    emoji: string;
  }) {
    this._dispatcher.actionsDispatcher().updateReaction?.({
      senderjid,
      reactionId,
      reactedby,
      emoji,
    });

    let stanza = this._xml(
      "message",
      {
        type: "chat",
        to: senderjid,
        id: this.generateId(5),
      },
      this._xml(
        "reactions",
        { id: reactionId, xmlns: "urn:xmpp:reactions:0" },
        this._xml("reaction", {}, emoji)
      )
    );

    await this.send(stanza);
  }

  async removeReaction({ reactionId, to }: { reactionId: string; to: string }) {
    this._dispatcher.actionsDispatcher().removeReaction?.({
      reactionId,
      jid: to,
      removedby: "self",
    });

    let reactionRemoveStanza = this._xml(
      "message",
      {
        type: "chat",
        to,
        id: this.generateId(5),
      },
      this._xml("reactions", { id: reactionId, xmlns: "urn:xmpp:reactions:0" })
    );

    this.send(reactionRemoveStanza);
  }

  async sendXep(s: stanzaElem) {
    this._logger.info("sending xep stanza");

    console.log("sending Xep from stanzaService");
    await this.send(s);
  }

  async send(payload: stanzaElem) {
    console.log("sendling payload to mqueue");
    await this._sendQueue.add(payload);
  }

  async sendChatAck(stanza: stanzaElem) {
    let { id, from } = stanza.attrs;

    stanza.children.forEach(async (child: Node) => {
      let xmlns;

      if (typeof child !== "string") xmlns = child.attrs.xmlns;
      else throw "invalid stanza";

      if (xmlns && xmlns.includes("urn:xmpp:receipts")) {
        let ackStanza = new this._xml.Element("message", {
          id: "message-ack",
          to: from.split("/")[0],
        });

        ackStanza.c("received", {
          xmlns,
          id,
        });

        await this.send(ackStanza);
        this._logger.info("Message Acknowledgement Sent");
      }
    });
  }

  acceptStanza(stanza: stanzaElem) {
    this._incomingStanzaHandler(stanza);
  }

  xepList() {
    return this._xepModule;
  }

  generateId(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  getTimestamp() {
    var d = new Date();
    let H = d.getHours(),
      M = d.getMinutes();
    // S = d.getSeconds(),
    // MONTH = d.getMonth(),
    // DAY = d.getDate();

    // return `${DAY}/${MONTH}-${H}:${M}:${S}`;
    return `${H}:${M}`;
  }

  onStanza(stanza: stanzaElem) {
    this._incomingStanzaHandler(stanza);
  }
}
