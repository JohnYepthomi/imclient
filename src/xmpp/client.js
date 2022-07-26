import { client, xml, jid } from "@xmpp/client";
import _store from "../store/store";
import MessageSendQueue from "../utils/MessageSendQueue.js";
import { newDirectMessage, updateLastMessage } from "../features/messageSlice";

class XmppClient {
  static clientJID;
  static xmpp;
  static credential;
  static status;

  static initXmpp(credentials) {
    this.clientJID = credentials.username; // add '@localhost' suffix
    this.credential = credentials;

    return new Promise((res) => {
      this.xmpp = client({
        service: "ws://ejimserver.herokuapp.com/",
        // service: 'ws://localhost:4200/',
        domain: "localhost",
        username: credentials.username,
        password: credentials.password,
        resource: "Desktop",
      });

      this.xmpp.on("error", async (err) => {
        console.log(err);
        await this.xmpp.stop();
        if (navigator.onLine) {
          this.initXmpp(this.credential);
          MessageSendQueue.send();
        }
      });

      this.xmpp.on("offline", async () => {
        console.log("You are currently offline...");
        await this.xmpp.stop();
        logClient("client has been stopped...");
      });

      this.xmpp.on("status", (status) => {
        console.log(status);
        this.status = status;
      });

      this.xmpp.on("stanza", async (stanza) => {
        console.log({ stanza });
        this.processStanza(stanza);
      });

      this.xmpp.on("online", async (address) => {
        await this.send(xml("presence"));
        localStorage.setItem("loggedOut", false);
        // await MessageSendQueue.send();
        res(true);
      });

      this.xmpp.start().catch(console.error);
    });
  }

  static async silentRestartIfOffline() {
    logClient("silentRestart() called from message queue");
    logClient("Restarting Client");
    await this.initXmpp(this.credential);
  }

  static async gracefulExit() {
    let exitPresence = new xml("presence", { type: "unavailable" });
    await this.xmpp.send(exitPresence);
    await this.xmpp.stop();
  }

  static getTimestamp() {
    var d = new Date();
    let H = d.getHours(),
      M = d.getMinutes(),
      S = d.getSeconds(),
      MONTH = d.getMonth(),
      DAY = d.getDate();

    return `${DAY}/${MONTH}-${H}:${M}:${S}`;
  }

  static getTimeDiff(a, b) {
    console.log({ a });
    console.log({ b });

    // let atime = a.split("-")[0];
    // let aday = +atime.split("/")[0];
    // let amonth = +atime.split("/")[1];

    // let btime = b.split("-")[0];
    // let bday = +btime.split("/")[0];
    // let bmonth = +btime.split("/")[1];

    let C = new Date(b);
    let P = new Date(a);
    const diffTime = Math.abs(C - P);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffTime;
  }

  static async setClientAvatar() {
    // let iq_set_vcard = new xml.Element('iq', {from: 'peter@localhost', type: 'set', id:'set-client-avatar'});
    // iq_set_vcard.c('vCard', {xmlns: "vcard-temp"})
    //     .c('PHOTO')
    //     .c('TYPE').t('image/png').up()
    //     .c('BINVAL').t(clientAvatarBase64);
    //await this.send(iq_set_vcard);
  }

  static async getClientAvatar() {
    let iq_get_vcard = new xml.Element("iq", {
      from: "peter@localhost",
      type: "get",
      id: "get-client-avatar",
    });
    iq_get_vcard.c("vCard", { xmlns: "vcard-temp" });
    await this.send(iq_get_vcard);
  }

  static async joinGroup(roomname = "friends") {
    let iq_join_muc = new xml.Element("presence", {
      from: "samuel@localhost",
      to: `${roomname}@conference.localhost/samharris`,
      id: "join-muc",
    });
    iq_join_muc.c("x", { xmlns: "http://jabber.org/protocol/muc" });
    await this.send(iq_join_muc);
  }

  static async sendMessage(to, body) {
    let message = xml(
      "message",
      { type: "chat", to: to, id: this.generateId(5) },
      xml("body", {}, body)
    );
    message.c("request", { xmlns: "urn:xmpp:receipts" });
    await this.send(message);
  }

  static async send(payload) {
    if (this.xmpp.socket && this.xmpp.socket.socket.readyState === 1) {
      await this.xmpp.send(payload);
      console.log("Message sent...");
    } else {
      console.log("throwing an error");
      throw "could not send";
    }
  }

  static async createInstantRoom(roomname, nickname) {
    let iq_join_muc = new xml.Element("presence", {
      to: `${roomname}@conference.localhost/${nickname}`,
      id: "create-instant-muc",
    });
    iq_join_muc.c("x", { xmlns: "http://jabber.org/protocol/muc" });
    await this.send(iq_join_muc);
  }

  static createConfigurableRoom() {
    // <iq from='crone1@shakespeare.lit/desktop'
    //     id='create1'
    //     to='coven@chat.shakespeare.lit'
    //     type='get'>
    //   <query xmlns='http://jabber.org/protocol/muc#owner'/>
    // </iq>

    let iq_configurable_room = new xml.Element("iq", { type: "get" });
    iq_configurable_room.c("query", {
      xmlns: "http://jabber.org/protocol/muc#owner",
    });
  }

  static checkAndResolveMessageAck(newmsg) {
    // REFER: https://xmpp.org/extensions/xep-0184.html
    newmsg.children.forEach(async (child) => {
      if (
        child.attrs.xmlns &&
        child.attrs.xmlns.includes("urn:xmpp:receipts")
      ) {
        let message_ack = new xml.Element("message", {
          id: "message-ack",
          to: newmsg.attrs.from.split("/")[0],
        });
        message_ack.c("received", {
          xmlns: "urn:xmpp:receipts",
          id: newmsg.attrs.id,
        });
        await this.send(message_ack);
        console.log("Message Acknowledgement Sent");
      }
    });
  }

  static async processStanza(stanza) {
    /* USERS ONLINE PRESENCE */
    if (stanza.is("presence")) {
      if (!stanza.attrs.hasOwnProperty("type")) {
        //store.dispatch(updateOnlineUsers());
        console.log(
          `%c Available Presence: ${stanza}`,
          "color: green; font-size: 0.85rem; font-family: ubuntu; font-style: italic"
        );
      } else if (stanza.attrs.type === "unavailable") {
        //store.dispatch(updateOnlineUsers());
        console.log(
          `%c Unavailable Presence: ${stanza}`,
          "color: red; font-size: 0.85rem; font-family: ubuntu; font-style: italic"
        );
      }
    }

    /* CLIENT USER AVATAR */
    if (stanza.attrs.id === "get-client-avatar") {
      let vcard = stanza.getChild("vCard");
      let photo = vcard.getChild("PHOTO");
      let binval = photo.getChild("BINVAL").getText();
      console.log({ binval });
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
            let iq_confirm_instant_room = new xml.Element("iq", {
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

            await this.send(iq_confirm_instant_room);
          }
        }
      }
    }

    /* USER MESSAGES FROM GROUPS AND DIRECT MESSAGES */
    if (stanza.is("message")) {
      console.log(stanza);
      if (stanza.attrs.type === "chat") {
        let new_msg = {
          from: stanza.attrs.from.split("/")[0],
          body: stanza.getChild("body").text(),
          stamp: getTimestamp(),
        };
        _store.dispatch(updateLastMessage(new_msg));
        _store.dispatch(newDirectMessage(new_msg));

        //Send Acknowledgement
        this.checkAndResolveMessageAck(stanza);
      } else if (
        stanza.attrs.id === "message-ack" &&
        stanza.children.some((child) => child.name === "received")
      ) {
        //update redux state and subsequently the view to signify the delivery of the message
        stanza.children.forEach((child) => {
          if (child.attrs)
            console.log(
              `Your message with id ${child.attrs.id} has been received by the receipient`
            );
        });
      } else if (stanza.attrs.type === "groupchat") {
        console.log("Group Message Stanza: ", stanza);
        // _store.dispatch(newGroupMessage());
      }
    }
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

function getTimestamp() {
  var d = new Date();
  let H = d.getHours(),
    M = d.getMinutes(),
    MONTH = d.getMonth(),
    DAY = d.getDate();

  return `${DAY}/${MONTH}-${H}:${M}`;
}

function logClient(item) {
  document.querySelector(".client-logger").innerText = item;

  // setTimeout(() => {
  //   document.querySelector(".client-logger").innerText = "client idle";
  // }, 2000);
}

export default XmppClient;
