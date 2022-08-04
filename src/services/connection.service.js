export default class ConnectionService {
  static status = "offline";

  static attachServices(connection, xmlBuilder, logService) {
    this._xmpp = connection;
    this._xml = xmlBuilder;
    this._logger = logService("ConnectionService -> ", "lightgreen");
  }

  static initXmpp() {
    //Implement restart of connection
    // requires connectionInfo
  }

  start() {}

  stop() {}

  isNetworkOnline() {
    if (!navigator.onLine)
      this._logger.info("Network Offline - Check your internet connection.");

    return navigator.onLine;
  }

  isConnectionOffline() {
    if (this.status === "offline" || this.status === "disconnecting") {
      this._logger.info(
        "Connection is offline or in the process of going offline.."
      );
      return true;
    } else return false;
  }

  isStreamRefreshing() {
    if (this.status !== "open") {
      this._logger.info("Stream refreshing...");
      return true;
    } else return false;
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
      this._logger.info("stanza sent sucessfully");
    } else {
      this._logger.error("could not send stanza");
      throw "could not send stanza";
    }
  }

  static setStatus(status) {
    this.status = status;
  }
}
