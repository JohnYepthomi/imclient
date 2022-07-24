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
    setTimeout(async () => {
      await this.send();
    }, 2500);
  }

  static async send() {
    if (!navigator.onLine || this.mq.length === 0) {
      logMessageQueue("offline");
      this.addOnlineListener();
      return;
    }

    this.isFree = false;

    if (XmppClient.readyState === 0) {
      logMessageQueue("readyState: " + XmppClient.readyState);
      this.tryAgain();
      return;
    } else if (XmppClient.readyState === 3 || XmppClient.readyState === 2) {
      logMessageQueue("readyState: " + XmppClient.readyState);
      await XmppClient.silentRestart();
      this.tryAgain();
      return;
    } else if (XmppClient.readyState === null) {
      logMessageQueue("readyState: " + XmppClient.readyState);
      await XmppClient.silentRestart();
      this.tryAgain();
      return;
    }

    logMessageQueue("sending message");
    await XmppClient.sendMessage(this.mq[0].senderjid, this.mq[0].message);
    //Also update redux state with message sent : true;
    this.removeHead();

    if (this.mq.length > 0) this.tryAgain();
    this.isFree = true;
  }

  static addOnlineListener() {
    const onOnline = async function onOnline() {
      await this.send();
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
