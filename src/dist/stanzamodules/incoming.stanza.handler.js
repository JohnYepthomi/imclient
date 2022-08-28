import StanzaService from '../services/stanza.service';

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class IncomingStanzaHandler extends StanzaService {
    constructor(XmlBuilder, LogService, DispatcherService, store) {
        super(XmlBuilder, LogService, DispatcherService, store);
        this._sendQueue = { add: () => { } };
        this._xepModule = {};
    }
    attachMods(SendQueue, xepModule) {
        this._sendQueue = SendQueue;
        this._xepModule = xepModule;
    }
    routeStanza(stanza) {
        stanza.is("presence") && this.presenceHandler(stanza);
        stanza.is("message") && this.mesageHandler(stanza);
        stanza.is("iq") && this.iqHandler(stanza);
    }
    presenceHandler(stanza) {
        const { type } = stanza.attrs;
        const HAS_TYPE_ATTR = stanza.attrs.hasOwnProperty("type");
        const CREATE_ROOM_ACK = this.isCreateRoomAck(stanza);
        if (CREATE_ROOM_ACK) {
            this.acceptDefaultRoomConfig(stanza);
            return;
        }
        if (type === "unavailable") {
            this._logger.info(`Unavailable Presence: ${stanza}`);
            return;
        }
        if (!HAS_TYPE_ATTR) {
            this._logger.info(`Available Presence: ${stanza}`);
            return;
        }
    }
    mesageHandler(stanza) {
        let { type, id } = stanza.attrs;
        if (type === "chat") {
            let isReactionMsg = stanza.children.some((child) => (typeof child !== 'string') && child.name === "reactions");
            if (isReactionMsg)
                this.processMessageReaction(stanza);
            else
                this.processChatMessage(stanza);
            return;
        }
        if (id === "message-ack") {
            let hasReceived = stanza.children.some((child) => (typeof child !== 'string') && child.name === "received");
            if (hasReceived)
                this.processMessageAck(stanza);
            return;
        }
        if (type === "groupchat") {
            this.processGroupMessage(stanza);
            return;
        }
        if (id === "direct-invitation-req") {
            this.acceptDirectInvitation(stanza);
            return;
        }
    }
    iqHandler(stanza) {
        console.log("iq-stanza: ", stanza);
    }
    processChatMessage(stanza) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, from } = stanza.attrs;
            let body = '';
            let sender = from.split("/")[0];
            let timestamp = this.getTimestamp();
            from = from.split("/")[0];
            stanza.children.forEach((child) => {
                if ((typeof child !== 'string') && child.name === "body")
                    body = child.children[0].toString();
            });
            let payload = {
                id,
                from,
                body,
                sender,
                timestamp,
            };
            this._dispatcher
                .actionsDispatcher()
                .newDirectMessage(payload);
            this._dispatcher
                .actionsDispatcher()
                .updateLastMessage(payload);
            yield this.sendChatAck(stanza);
        });
    }
    processMessageReaction(stanza) {
        let jid = stanza.attrs.from.split("/")[0];
        let reactionId = stanza.getChild("reactions").attrs.id;
        let isRemoveReq = stanza.getChild("reactions").children.length === 0;
        let reactedby;
        let emoji;
        if (!isRemoveReq) {
            emoji = stanza.getChild("reactions").getChild("reaction").children[0];
            reactedby = stanza.attrs.from.split("/")[0];
            this._dispatcher
                .actionsDispatcher()
                .updateReaction({ reactedby, reactionId, jid, emoji });
        }
        else {
            this._dispatcher
                .actionsDispatcher()
                .removeReaction({ reactionId, jid, removedby: jid });
        }
    }
    processMessageAck(stanza) {
        stanza.children.forEach((child) => {
            let id = '';
            if ((typeof child !== 'string'))
                id = child.attrs.id;
            if (id !== '' && (typeof child !== 'string')) {
                this._logger.info(`message delivered: id ${child.attrs.id} `);
                this._dispatcher
                    .actionsDispatcher()
                    .updateDeliveredMessage({ id });
            }
        });
    }
    processGroupMessage(stanza) {
        let { id, from } = stanza.attrs;
        let gid = from;
        let groupName = gid.split("@")[0];
        let timestamp = this.getTimestamp();
        let body = '';
        from = from.split("/")[0];
        stanza.children.forEach((child) => {
            if (typeof child !== 'string' && child.name === "body")
                body = child.children[0].toString();
        });
        const payload = {
            id,
            gid,
            from,
            body,
            groupName,
            timestamp,
        };
        this._dispatcher
            .actionsDispatcher()
            .newGroupMessage(payload);
    }
    acceptDefaultRoomConfig(stanza) {
        return __awaiter(this, void 0, void 0, function* () {
            let subject = stanza.attrs.from.split("@")[0];
            yield this.xepList().createInstantRoom(subject);
            this._dispatcher.actionsDispatcher().setGroupCreated(true);
        });
    }
    acceptDirectInvitation(stanza) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, from } = stanza.attrs;
            let gid = stanza.getChild("x").attrs.jid;
            let groupName = gid.split('@')[0];
            let payload = {
                id,
                gid,
                from,
                body: "na",
                groupName,
                timestamp: this.getTimestamp(),
                delivered: undefined,
                sent: undefined,
                createEvent: true,
                joinEvent: false,
            };
            yield this.sendGroupPresence(gid);
            this._dispatcher
                .actionsDispatcher()
                .newGroupMessage(payload);
        });
    }
    isCreateRoomAck(presence) {
        let child = presence === null || presence === void 0 ? void 0 : presence.getChild('x', "http://jabber.org/protocol/muc#user");
        let xChildren = child && child.getChildren('status');
        let status_Els = xChildren === null || xChildren === void 0 ? void 0 : xChildren.filter(child => child.name === 'status');
        let STATUS_CODES = [];
        status_Els === null || status_Els === void 0 ? void 0 : status_Els.forEach(s => {
            let { code } = s.attrs;
            if (code === '201' || code === '110') {
                STATUS_CODES.push(true);
            }
        });
        if (STATUS_CODES[0] === true && STATUS_CODES[1] === true)
            return true;
        else
            return false;
    }
    isGroupPresence(presence) {
        return presence.attrs.from.includes('@conference');
    }
}
