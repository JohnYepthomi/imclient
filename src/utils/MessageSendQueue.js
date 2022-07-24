import XmppClient from "../xmpp/client.js";
import _store from "../store/store";

/* FIFO Message Queue */
class MessageSendQueue {
  static mq = [];
  static isFree = true;
  static online = false;

  static add(payload) {
    this.mq.push(payload);

    if (this.isFree) this.send();
  }

  static removeHead() {
    let shiftedElement = this.mq.shift();
  }

  static tryAgain() {
    logMessageQueue("retrying send message");
    setTimeout(async () => {
      await this.send();
    }, 2500);
  }

  static async send() {
    if (this.mq.length === 0) return;

    if (!navigator.onLine) {
      logMessageQueue("offline");
      this.addOnlineListener();
      return;
    }

    if (XmppClient.status === "offline") {
      await XmppClient.silentRestartIfOffline();
      this.tryAgain();
    }

    if (XmppClient.status !== "online") {
      this.tryAgain();
      return;
    }

    logMessageQueue("XmppClient.status: ", XmppClient.status);

    this.isFree = false;

    logMessageQueue("sending message");
    try {
      await XmppClient.sendMessage(this.mq[0].senderjid, this.mq[0].message);
      //Also update redux state with message sent : true;
      this.removeHead();
      if (this.mq.length > 0) this.tryAgain();
      this.isFree = true;
    } catch (e) {
      console.log(e);
      this.tryAgain();
      return;
    }
  }

  static addOnlineListener() {
    const onOnline = async function onOnline() {
      window.removeEventListener("online", onOnline);
      logMessageQueue("connection back online");
      if (XmppClient.status === "offline") {
        await XmppClient.silentRestartIfOffline();
        await this.send();
      } else this.send();
    }.bind(this);
    window.addEventListener("online", onOnline);
  }
}

function logMessageQueue(item) {
  document.querySelector(".queue-logger").innerText = item;

  setTimeout(() => {
    document.querySelector(".queue-logger").innerText = "queue idle";
  }, 2000);
}

export default MessageSendQueue;
