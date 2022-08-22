var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class StanzaService {
    constructor(XmlBuilder, LogService, DispatcherService, stanzaHandler, store) {
        this._xml = XmlBuilder;
        this._logger = LogService("StanzaService -> ", "orange");
        this._dispatcher = DispatcherService;
        this._incomingStanzaHandler = stanzaHandler.bind(this);
        this._store = store;
        this._xepModule = {};
        this._sendQueue = { add: () => { } };
    }
    attachMod(XepMod, SendQueue) {
        this._xepModule = XepMod;
        this._sendQueue = SendQueue;
    }
    sendPresence(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let stanza = this._xml("presence", type && type === "unavailable" ? { type: "unavailable" } : "");
            this.send(stanza);
        });
    }
    sendChat({ jid, body }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
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
            (_b = (_a = this._dispatcher.actionsDispatcher()).newDirectMessage) === null || _b === void 0 ? void 0 : _b.call(_a, m);
            (_d = (_c = this._dispatcher.actionsDispatcher()).updateLastMessage) === null || _d === void 0 ? void 0 : _d.call(_c, m);
            let stanza = this._xml("message", { type: "chat", to: jid, id }, this._xml("body", {}, body));
            stanza.c("request", { xmlns: "urn:xmpp:receipts" });
            yield this.send(stanza);
        });
    }
    sendGroupChat({ gid, body, groupName, }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let id = this.generateId(5);
            let timestamp = this.getTimestamp();
            let m = {
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
                gid = gid.split("/")[0];
            }
            (_b = (_a = this._dispatcher.actionsDispatcher()).newGroupMessage) === null || _b === void 0 ? void 0 : _b.call(_a, m);
            (_d = (_c = this._dispatcher.actionsDispatcher()).updateLastMessage) === null || _d === void 0 ? void 0 : _d.call(_c, m);
            let stanza = this._xml("message", { type: "groupchat", to: gid, id }, this._xml("body", {}, body));
            console.log({ gid });
            stanza.c("request", { xmlns: "urn:xmpp:receipts" });
            yield this.send(stanza);
        });
    }
    sendReaction({ reactionId, reactedby, senderjid, emoji, }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            (_b = (_a = this._dispatcher.actionsDispatcher()).updateReaction) === null || _b === void 0 ? void 0 : _b.call(_a, {
                senderjid,
                reactionId,
                reactedby,
                emoji,
            });
            let stanza = this._xml("message", {
                type: "chat",
                to: senderjid,
                id: this.generateId(5),
            }, this._xml("reactions", { id: reactionId, xmlns: "urn:xmpp:reactions:0" }, this._xml("reaction", {}, emoji)));
            yield this.send(stanza);
        });
    }
    removeReaction({ reactionId, to }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            (_b = (_a = this._dispatcher.actionsDispatcher()).removeReaction) === null || _b === void 0 ? void 0 : _b.call(_a, {
                reactionId,
                jid: to,
                removedby: "self",
            });
            let reactionRemoveStanza = this._xml("message", {
                type: "chat",
                to,
                id: this.generateId(5),
            }, this._xml("reactions", { id: reactionId, xmlns: "urn:xmpp:reactions:0" }));
            this.send(reactionRemoveStanza);
        });
    }
    sendXep(s) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info("sending xep stanza");
            console.log("sending Xep from stanzaService");
            yield this.send(s);
        });
    }
    send(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("sendling payload to mqueue");
            yield this._sendQueue.add(payload);
        });
    }
    sendChatAck(stanza) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, from } = stanza.attrs;
            stanza.children.forEach((child) => __awaiter(this, void 0, void 0, function* () {
                let xmlns;
                if (typeof child !== "string")
                    xmlns = child.attrs.xmlns;
                else
                    throw "invalid stanza";
                if (xmlns && xmlns.includes("urn:xmpp:receipts")) {
                    let ackStanza = new this._xml.Element("message", {
                        id: "message-ack",
                        to: from.split("/")[0],
                    });
                    ackStanza.c("received", {
                        xmlns,
                        id,
                    });
                    yield this.send(ackStanza);
                    this._logger.info("Message Acknowledgement Sent");
                }
            }));
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
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    getTimestamp() {
        var d = new Date();
        let H = d.getHours(), M = d.getMinutes();
        return `${H}:${M}`;
    }
    onStanza(stanza) {
        this._incomingStanzaHandler(stanza);
    }
}
