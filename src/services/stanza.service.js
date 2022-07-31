class StanzaService {
  constructor(SendQueue, XmlBuilder, LogService, DispatcherService) {
    this._xml = XmlBuilder;
    this._logger = LogService("StanzaService -> ", "orange");
    this._dispatcher = DispatcherService;
    this._logger.info("StanzaService constructor called");
    this._sendQueue = SendQueue;
  }

  attachMod(XepMod) {
    this._xepModule = XepMod;
  }

  async sendChat(messageObject) {
    let { from, body, id } = messageObject;

    this._dispatcher.actionsDispatcher().newDirectMessage(messageObject);
    this._dispatcher.actionsDispatcher().updateLastMessage(messageObject);
    let message = this._xml(
      "message",
      { type: "chat", to: from, id },
      this._xml("body", {}, body)
    );
    message.c("request", { xmlns: "urn:xmpp:receipts" });
    await this._sendQueue.add(message);
  }

  async sendXep(s) {
    this._logger.info("sending xep stanza");
    await this._sendQueue.add(s);
  }

  xepList() {
    return this._xepModule;
  }
}

class SendQueue {
  mq = [];
  retryDone = true;
  listenerLoaded = false;

  constructor(clientService, dispatcher, logService) {
    this._logger = logService("SendQueue -> ", "pink");
    this._logger.info("SendQueue constructor called");
    this._clientService = clientService;
    this._dispatcher = dispatcher;
  }

  async add(payload) {
    this.mq.push(payload);
    await this.send();
  }

  removeHead() {
    this.mq.shift();
  }

  tryAgain() {
    this._logger.info("retrying send message");
    if (this.retryDone)
      setTimeout(async () => {
        this._logger.info("sending message on tryAgain() timeout");
        await this.send();
        this.retryDone = true;
      }, 2500);
  }

  async send() {
    if (this.mq.length === 0) return;

    this._logger.info("XmppClient.status: " + this._clientService.status);

    if (!navigator.onLine) {
      this._logger.info("offline");
      if (!this.listenerLoaded) {
        this.addOnlineListener();
        this.listenerLoaded = true;
      }
      return;
    }

    if (this._clientService.status === "offline") {
      await this._clientService.silentRestartIfOffline();
      this.tryAgain();
      this.retryDone = false;
    }

    if (
      this._clientService.status === "disconnect" ||
      this._clientService.status === "disconnecting" ||
      this._clientService.status === "connecting" ||
      this._clientService.status === "connect" ||
      this._clientService.status === "opening"
    ) {
      this.tryAgain();
      this.retryDone = false;
      return;
    }

    this._logger.info("sending message");

    try {
      this._dispatcher
        .actionsDispatcher()
        .updateSentMessage({ id: this.mq[0].attrs.id });
      await this._clientService._xmpp.send(this.mq[0]);
      this.removeHead();
      if (this.mq.length > 0) this.tryAgain();
    } catch (e) {
      this._logger.error(e);
      this.tryAgain();
      return;
    }
  }

  addOnlineListener() {
    const onOnline = async function onOnline() {
      window.removeEventListener("online", onOnline);
      this._logger.info("connection back online");
      if (this._clientService.status === "offline") {
        await this._clientService.silentRestartIfOffline();
      }
      await this.send();
      this.listenerLoaded = false;
    }.bind(this);
    window.addEventListener("online", onOnline);
  }
}

class XepModule {
  constructor(stanzaService, logService) {
    this._logger = logService("xepModule -> ", "aqua");
    this._stanzaService = stanzaService;
    this._logger.info("XepModule constructor called");
  }

  async setClientAvatar() {
    // let iq_set_vcard = new this._stanzaService._xml.Element('iq', {from: 'peter@localhost', type: 'set', id:'set-client-avatar'});
    // iq_set_vcard.c('vCard', {xmlns: "vcard-temp"})
    //     .c('PHOTO')
    //     .c('TYPE').t('image/png').up()
    //     .c('BINVAL').t(clientAvatarBase64);
    //await this._stanzaService.sendXep(iq_set_vcard);
  }

  async getClientAvatar() {
    let iq_get_vcard = new this._stanzaService._xml.Element("iq", {
      from: "peter@localhost",
      type: "get",
      id: "get-client-avatar",
    });
    iq_get_vcard.c("vCard", { xmlns: "vcard-temp" });
    await this._stanzaService.sendXep(iq_get_vcard);
  }

  async joinGroup(roomname = "friends") {
    let iq_join_muc = new this._stanzaService._xml.Element("presence", {
      from: "samuel@localhost",
      to: `${roomname}@conference.localhost/samharris`,
      id: "join-muc",
    });
    iq_join_muc.c("x", { xmlns: "http://jabber.org/protocol/muc" });
    await this._stanzaService.sendXep(iq_join_muc);
  }

  async createInstantRoom(params) {
    let { roomname, nickname } = params;
    let iq_join_muc = new this._stanzaService._xml.Element("presence", {
      to: `${roomname}@conference.localhost/${nickname}`,
      id: "create-instant-muc",
    });
    iq_join_muc.c("x", { xmlns: "http://jabber.org/protocol/muc" });
    await this._stanzaService.sendXep(iq_join_muc);
  }

  async createConfigurableRoom() {
    // <iq from='crone1@shakespeare.lit/desktop'
    //     id='create1'
    //     to='coven@chat.shakespeare.lit'
    //     type='get'>
    //   <query xmlns='http://jabber.org/protocol/muc#owner'/>
    // </iq>

    let iq_configurable_room = new this._stanzaService._xml.Element("iq", {
      type: "get",
    });
    iq_configurable_room.c("query", {
      xmlns: "http://jabber.org/protocol/muc#owner",
    });

    await this._stanzaService.sendXep(iq_configurable_room);
  }
}

export default function initStanzaService(
  ClientService,
  xmlBuilder,
  logServiceFactory,
  DispatcherService
) {
  console.log("initStanzaService called");
  let sendQueue = new SendQueue(
    ClientService,
    DispatcherService,
    logServiceFactory()
  );

  let stanzaServiceInstance = new StanzaService(
    sendQueue,
    xmlBuilder,
    logServiceFactory(),
    DispatcherService
  );
  let xepModule = new XepModule(stanzaServiceInstance, logServiceFactory());

  stanzaServiceInstance.attachMod(xepModule);

  return stanzaServiceInstance;
}
