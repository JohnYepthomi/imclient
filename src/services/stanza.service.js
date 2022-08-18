export default class StanzaService {
  constructor(XmlBuilder, LogService, DispatcherService, stanzaHandler, store) {
    this._xml = XmlBuilder;
    this._logger = LogService("StanzaService -> ", "orange");
    this._dispatcher = DispatcherService;
    this._incomingStanzaHandler = stanzaHandler.bind(this);
    this._store = store;
  }

  attachMod(XepMod, SendQueue) {
    this._xepModule = XepMod;
    this._sendQueue = SendQueue;
  }

  async sendPresence(type) {
    let stanza = this._xml(
      "presence",
      type && type === "unavailable" ? { type: "unavailable" } : ""
    );
    this.send(stanza);
  }

  async sendChat({ jid, body }) {
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

    this._dispatcher.actionsDispatcher().newDirectMessage(m);
    this._dispatcher.actionsDispatcher().updateLastMessage(m);

    let stanza = new this._xml(
      "message",
      { type: "chat", to: jid, id },
      this._xml("body", {}, body)
    );

    stanza.c("request", { xmlns: "urn:xmpp:receipts" });
    await this.send(stanza);
  }

  async sendGroupChat({ gid, body, nick }) {
    let id = this.generateId(5);
    let timestamp = this.getTimestamp();

    let m = {
      id,
      gid,
      from: "self",
      body,
      timestamp,
      delivered: false,
      sent: false,
    };

    this._dispatcher.actionsDispatcher().newGroupMessage(m);
    this._dispatcher.actionsDispatcher().updateLastMessage(m);

    let stanza = new this._xml(
      "message",
      { type: "chat", to: gid, id },
      this._xml("body", {}, body)
    );

    stanza.c("request", { xmlns: "urn:xmpp:receipts" });
    await this.send(stanza);
  }

  async sendGroupChat({ groupname, nick, body }) {
    let id = this.generateId(5);
    let stamp = this.getTimestamp();

    let m = {
      id,
      from: groupname,
      body,
      stamp,
      isClientMessage: true,
      delivered: false,
      sent: false,
    };

    this._dispatcher.actionsDispatcher().newGroupMessage(m);
    this._dispatcher.actionsDispatcher().updateLastGroupMessage(m);

    let stanza = new this._xml(
      "message",
      {
        type: "groupchat",
        to: `${groupname}@conference.localhost/${nick}`,
        id,
      },
      this._xml("body", {}, body)
    );

    stanza.c("request", { xmlns: "urn:xmpp:receipts" });
    await this.send(stanza);
  }

  async sendReaction({ reactionId, reactedby, jid, emoji }) {
    this._dispatcher.actionsDispatcher().updateReaction({
      jid,
      reactionId,
      reactedby,
      emoji,
    });

    let stanza = this._xml(
      "message",
      {
        type: "chat",
        to: jid,
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

  async removeReaction({ reactionId, to }) {
    this._dispatcher.actionsDispatcher().removeReaction({
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

  async sendXep(s) {
    this._logger.info("sending xep stanza");

    console.log("sending Xep from stanzaService");
    await this.send(s);
  }

  async send(payload) {
    console.log("sendling payload to mqueue");
    await this._sendQueue.add(payload);
  }

  async sendChatAck(stanza) {
    let { id, from } = stanza.attrs;

    stanza.children.forEach(async (child) => {
      let { xmlns } = child.attrs;

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

  acceptStanza(stanza) {
    this._incomingStanzaHandler(stanza);
  }

  xepList() {
    return this._xepModule;
  }

  generateId(length) {
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
      M = d.getMinutes(),
      S = d.getSeconds(),
      MONTH = d.getMonth(),
      DAY = d.getDate();

    return `${DAY}/${MONTH}-${H}:${M}:${S}`;
  }

  onStanza(stanza) {
    this._incomingStanzaHandler(stanza);
  }
}
