export default class ClientService {
  static _xmpp;

  static attachServices(
    client,
    userService,
    xmlBuilder,
    dispatcher,
    logService
  ) {
    this._userService = userService;
    this._logger = logService("ClientService -> ", "lightgreen");
    this._logger.info("ClientService attached services");
    this._xml = xmlBuilder;
    this._dispatcher = dispatcher;
    this._client = client;
  }

  static logIn() {
    return new Promise((res) => {
      this._logger.info("initing");

      this._xmpp = this._client({
        service: this._userService.getService(),
        domain: this._userService.getDomain(),
        username: this._userService.getId(),
        password: this._userService.getPassword(),
        resource: this._userService.getResource(),
      });

      this._xmpp.on("offline", () => {
        this._logger.info("xmpp offline");
      });

      this._xmpp.on("status", (status) => {
        this._logger.info(`status-> ${status}`);
      });

      this._xmpp.on("error", async (err) => {
        this._logger.error(err);
        await this._xmpp.stop();
      });

      this._xmpp.on("online", () => {
        this._xmpp.send(this._xml("presence"));
        this._logger.info("init resolved");
        this._logger.info("online");
        res(true);
      });

      this._xmpp.on("stanza", (stanza) => {
        this.filterStanza(stanza);
      });

      this._xmpp.start().catch(console.error);
    });
  }

  static getClient() {
    return this._xmpp;
  }

  static async silentRestartIfOffline() {
    this._logger.info("silent restart initialted...");
    await this.initXmpp(this._credential);
  }

  static async gracefulExit() {
    this._logger.info("graceFully Exiting...");
    let exitPresence = new this._xml("presence", { type: "unavailable" });
    await this._xmpp.send(exitPresence);
    await this._xmpp.stop();
  }

  static async send(payload) {
    if (this._xmpp.socket && this._xmpp.socket.socket.readyState === 1) {
      this._logger.info("sending stanza...");
      await this._xmpp.send(payload);
      this._logger.info("sending sent");
    } else {
      this._logger.error("could not send stanza");
      throw "could not send stanza";
    }
  }

  static async filterStanza(stanza) {
    /* USERS ONLINE PRESENCE */
    if (stanza.is("presence")) {
      if (!stanza.attrs.hasOwnProperty("type")) {
        //this._dispatcher.actionsDispatcher().updateOnlineUsers();
        this._logger.info(`Available Presence: ${stanza}`);
      } else if (stanza.attrs.type === "unavailable") {
        //this._dispatcher.actionsDispatcher().updateOfflineUsers();
        this._logger.info(`Unavailable Presence: ${stanza}`);
      }
    }

    /* CLIENT USER AVATAR */
    if (stanza.attrs.id === "get-client-avatar") {
      let vcard = stanza.getChild("vCard");
      let photo = vcard.getChild("PHOTO");
      let binval = photo.getChild("BINVAL").getText();
      this._logger.info({ binval });
      //document.querySelector('.no-messages').innerHTML = '<img src="data:image/png;base64,' + binval + '" /><div>No Messages</div> ';
    }

    /* CONFIRM CREATION OF INSTANT GROUP CHAT */
    if (stanza.attrs.id === "create-instant-muc") {
      /* Refer: https://xmpp.org/extensions/xep-0045.html#createroom */
      if (stanza.is("presence")) {
        if (stanza.attrs.id === "create-instant-muc") {
          let status_codes = [];
          let user_affiliation;
          let user_role;

          stanza.children.forEach((child) => {
            let namespace = child.attrs.xmlns;

            if (
              namespace &&
              namespace.includes("http://jabber.org/protocol/muc#user")
            ) {
              child.children.forEach((children) => {
                let receivedStatusCode = children.attrs.code;

                if (children.getName() === "status") {
                  status_codes.push(receivedStatusCode);
                } else if (children.getName() === "item") {
                  user_affiliation = children.attrs.affiliation;
                  user_role = children.attrs.role;
                }
              });
            }
          });

          if (
            status_codes.some((status) => status === "110") &&
            status_codes.some((status) => status === "201")
          ) {
            let from = stanza.attrs.from;
            let iq_confirm_instant_room = new this._xml.Element("iq", {
              to: from,
              id: "confirm-instant-room",
              type: "set",
            });
            iq_confirm_instant_room.c("query", {
              xmlns: "http://jabber.org/protocol/muc#owner",
            });
            iq_confirm_instant_room.c("x", {
              xmlns: "jabber:x:data",
              type: "submit",
            });

            await this._xmpp.sendXep(iq_confirm_instant_room);
          }
        }
      }
    }

    /* USER MESSAGES FROM GROUPS AND DIRECT MESSAGES */
    if (stanza.is("message")) {
      if (stanza.attrs.type === "chat") {
        let new_msg = {
          from: stanza.attrs.from.split("/")[0],
          body: stanza.getChild("body").text(),
          stamp: this.getTimestamp(),
          sent: false,
          delivered: false,
          id: "",
          isClientMessage: false,
        };

        this._dispatcher.actionsDispatcher().newDirectMessage(new_msg);
        this._dispatcher.actionsDispatcher().updateLastMessage(new_msg);

        this.sendAck(stanza);
      } else if (
        stanza.attrs.id === "message-ack" &&
        stanza.children.some((child) => child.name === "received")
      ) {
        stanza.children.forEach((child) => {
          if (child.attrs) {
            this._logger.info(`message delivered: id ${child.attrs.id} `);
            this._dispatcher
              .actionsDispatcher()
              .updateDeliveredMessage({ id: child.attrs.id });
            this._logger.info(`dispatched id: ${child.attrs.id}`);
          }
        });
      } else if (stanza.attrs.type === "groupchat") {
        this._logger.info("Group Message Stanza: ", stanza);
        // this._dispatcher.actionsDispatcher().newGroupMessage();
      }
    }
  }

  static getTimestamp() {
    var d = new Date();
    let H = d.getHours(),
      M = d.getMinutes(),
      MONTH = d.getMonth(),
      DAY = d.getDate();

    return `${DAY}/${MONTH}-${H}:${M}`;
  }

  static sendAck(newmsg) {
    // REFER: https://xmpp.org/extensions/xep-0184.html
    newmsg.children.forEach(async (child) => {
      if (
        child.attrs.xmlns &&
        child.attrs.xmlns.includes("urn:xmpp:receipts")
      ) {
        let message_ack = new this._xml.Element("message", {
          id: "message-ack",
          to: newmsg.attrs.from.split("/")[0],
        });
        message_ack.c("received", {
          xmlns: "urn:xmpp:receipts",
          id: newmsg.attrs.id,
        });

        await this._xmpp.send(message_ack);
        this._logger.info("Message Acknowledgement Sent");
      }
    });
  }

  static generateId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
