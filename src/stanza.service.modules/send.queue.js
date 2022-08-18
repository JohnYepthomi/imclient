/**
 * @Requries {Object} xmpp connected Object
 * @Requires {Class} Redux Dispatcher Service
 */

export default class SendQueue {
  mq = [];
  retryDone = true;
  listenerLoaded = false;

  constructor(connection, dispatcher, logService) {
    this._conn = connection;
    this._dispatcher = dispatcher;
    this._logger = logService("SendQueue -> ", "pink");
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

    this._logger.info("XmppClient.status: " + this._conn.status);

    if (!navigator.onLine) {
      this._logger.info("offline");
      if (!this.listenerLoaded) {
        this.addOnlineListener();
        this.listenerLoaded = true;
      }
      return;
    }

    if (this._conn.status === "offline") {
      await this._conn.silentRestartIfOffline();
      this.tryAgain();
      this.retryDone = false;
    }

    if (
      this._conn.status === "disconnect" ||
      this._conn.status === "disconnecting" ||
      this._conn.status === "connecting" ||
      this._conn.status === "connect" ||
      this._conn.status === "opening"
    ) {
      this.tryAgain();
      this.retryDone = false;
      return;
    }

    this._logger.info("sending message");

    try {
      let messageId = this.mq[0].attrs.id;

      if (this.mq[0].attrs.type === "chat") {
        this._dispatcher
          .actionsDispatcher()
          .updateSentMessage({ id: messageId });
      } else if (this.mq[0].attrs.type === "groupchat") {
        this._dispatcher
          .actionsDispatcher()
          .updateGroupSentMessage({ id: messageId });
      }

      await this._conn.send(this.mq[0]);
      this.removeHead();
      if (this.mq.length > 0) this.tryAgain();
    } catch (e) {
      this._logger.info(e);
      this.tryAgain();
    }
  }

  addOnlineListener() {
    const onOnline = async function onOnline() {
      window.removeEventListener("online", onOnline);
      this._logger.info("connection back online");
      if (this._conn.status === "offline") {
        await this._conn.silentRestartIfOffline();
      }
      await this.send();
      this.listenerLoaded = false;
    }.bind(this);
    window.addEventListener("online", onOnline);
  }
}
