import XmppClient from "../xmpp/client.js";
import _store from "../store/store";

/* FIFO Message Queue */
class MessageSendQueue {
  static mq = [];
  static retryDone = true;
  static listenerLoaded = false;

  static add(payload) {
    this.mq.push(payload);
    this.send();
  }

  static removeHead() {
    this.mq.shift();
  }

  static tryAgain() {
    logMessageQueue("retrying send message");
    if (this.retryDone)
      setTimeout(async () => {
        logMessageQueue("sending message on tryAgain() timeout");
        await this.send();
        this.retryDone = true;
      }, 2500);
  }

  static async send() {
    if (this.mq.length === 0) return;

    logMessageQueue("XmppClient.status: " + XmppClient.status);

    if (!navigator.onLine) {
      logMessageQueue("offline");
      if (!this.listenerLoaded) {
        this.addOnlineListener();
        this.listenerLoaded = true;
      }
      return;
    }

    if (XmppClient.status === "offline") {
      await XmppClient.silentRestartIfOffline();
      this.tryAgain();
      this.retryDone = false;
    }

    if (
      XmppClient.status === "disconnect" ||
      XmppClient.status === "disconnecting" ||
      XmppClient.status === "connecting" ||
      XmppClient.status === "connect" ||
      XmppClient.status === "opening"
    ) {
      this.tryAgain();
      this.retryDone = false;
      return;
    }

    logMessageQueue("sending message");
    try {
      await XmppClient.sendMessage(this.mq[0].senderjid, this.mq[0].message);
      //Also update redux state with message sent : true;
      this.removeHead();
      if (this.mq.length > 0) this.tryAgain();
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
      } else {
        this.send();
      }

      this.listenerLoaded = false;
    }.bind(this);
    window.addEventListener("online", onOnline);
  }
}

function logMessageQueue(item) {
  document.querySelector(".queue-logger").innerText = item;
}

export default MessageSendQueue;
