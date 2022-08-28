import { Store } from "@reduxjs/toolkit";
import DispatcherService from "./dispatcher.service";
import { Node, Element as stanzaElem } from "@xmpp/xml";
import {xmlType, SendQueue, XepModule, GroupChatPayload, ChatPayload, StanzaServiceInterface, LogServiceType, LoggerObjectType } from './service.types';

export default class StanzaService implements StanzaServiceInterface {
  public _xml: xmlType;
  public _dispatcher: DispatcherService;
  public _store: Store;
  public _logger: LoggerObjectType;
  public _xepModule: XepModule;
  public _sendQueue: SendQueue;

  constructor(
    XmlBuilder: xmlType,
    LogService: LogServiceType,
    DispatcherService: DispatcherService,
    store: Store
  ) {
    this._xml = XmlBuilder;
    this._logger = LogService("StanzaService -> ", "orange");
    this._dispatcher = DispatcherService;
    this._store = store;
    this._xepModule = {};
    this._sendQueue = { add: () => {} };
  }

  attachMod(XepMod: XepModule, SendQueue: SendQueue) {
    this._xepModule = XepMod;
    this._sendQueue = SendQueue;
  }

  async sendPresence(type: string) {
    let stanza = this._xml(
      "presence",
      type && type === "unavailable" ? { type: "unavailable" } : ""
    );

    // console.log('sending group presence');
    this.send(stanza);
    // console.log('group presence sent!');
  }

  sendGroupPresence(gid: string){
    let randomNick = this.generateId(5);
    let gidWithNick = gid + '/' + randomNick;
    let newGroupPresence = this._xml('presence', {id: this.generateId(5), to: gidWithNick, }, this._xml('x', {xmlns: 'http://jabber.org/protocol/muc'}));
    this.send(newGroupPresence);
  }

  async sendChat({ jid, body }: { jid: string; body: string }) {
    let id = this.generateId(5);
    let timestamp = this.getTimestamp();

    let m: ChatPayload = {
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
    let m: GroupChatPayload = {
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

    stanza.c("request", { xmlns: "urn:xmpp:receipts" });
    await this.send(stanza);
  }

  async sendReaction({reactionId, reactedby, sender, emoji}: {sender : string; reactionId: string; reactedby: string; emoji: string;}) {
    let reactionPayload : {sender : string; reactionId: string; reactedby: string; emoji: string;} = {
      sender,
      reactionId,
      reactedby,
      emoji,
    };
    let stanza = this._xml(
      "message",
      {
        type: "chat",
        to: sender,
        id: this.generateId(5),
      },
      this._xml(
        "reactions",
        { id: reactionId, xmlns: "urn:xmpp:reactions:0" },
        this._xml("reaction", {}, emoji)
      )
    );

    this._dispatcher.actionsDispatcher().updateReaction?.(reactionPayload);
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

  async sendXep(stanza: stanzaElem) {
    this._logger.info("sending xep stanza");
    await this.send(stanza);
  }

  async send(payload: stanzaElem) {
    // console.log("sendling payload to mqueue");
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
}
