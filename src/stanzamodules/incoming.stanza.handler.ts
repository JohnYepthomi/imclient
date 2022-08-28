import { Store } from '@reduxjs/toolkit';
import { Element as stanzaElem } from "@xmpp/xml";
import StanzaService from '../services/stanza.service';
import DispatcherService from "../services/dispatcher.service";
import {xmlType, SendQueue, XepModule, ChatPayload, GroupChatPayload, LogServiceType } from '../services/service.types';

export default class IncomingStanzaHandler extends StanzaService{
  public _sendQueue: SendQueue;
  public _xepModule: XepModule;

  constructor(XmlBuilder: xmlType, LogService: LogServiceType, DispatcherService: DispatcherService, store: Store){
    super(XmlBuilder, LogService, DispatcherService,store);
    this._sendQueue = {add: ()=> {}} //Dummy initialisation
    this._xepModule = {};  //Dummy initialisation
  }

  attachMods(SendQueue: SendQueue, xepModule: XepModule ){
    this._sendQueue = SendQueue;
    this._xepModule = xepModule;
  }

  routeStanza(stanza: stanzaElem) {
    stanza.is("presence") && this.presenceHandler(stanza);
    stanza.is("message") && this.mesageHandler(stanza);
    stanza.is("iq") && this.iqHandler(stanza);
  }

  /* Handlers */
  presenceHandler(stanza: stanzaElem) {
    const { type } = stanza.attrs;
    const HAS_TYPE_ATTR : boolean = stanza.attrs.hasOwnProperty("type");
    const CREATE_ROOM_ACK: boolean = this.isCreateRoomAck(stanza);

    if(CREATE_ROOM_ACK){
      this.acceptDefaultRoomConfig(stanza);
      // this.submitPreConfigRoomIQ(stanza);
      return;
    }

    if (type === "unavailable") {
      this._logger.info(`Unavailable Presence: ${stanza}`);
      return;
    }

    if (!HAS_TYPE_ATTR) { /* EVAL AT LAST */
      this._logger.info(`Available Presence: ${stanza}`);
      return
    }
  }

  mesageHandler(stanza: stanzaElem) {
    let { type, id } = stanza.attrs;

    if (type === "chat") {
      let isReactionMsg = stanza.children.some((child) => (typeof child !== 'string') && child.name === "reactions");
      if (isReactionMsg) this.processMessageReaction(stanza);
      else this.processChatMessage(stanza);

      return;
    }

    if (id === "message-ack") {
      let hasReceived = stanza.children.some((child) => (typeof child !== 'string') && child.name === "received");
      if (hasReceived) this.processMessageAck(stanza);

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

  iqHandler(stanza: stanzaElem) {
    console.log("iq-stanza: ", stanza);
    // this.roomCreationResultIQ();
  }

  /* Resolvers */
  async processChatMessage(stanza: stanzaElem) {
    // console.log("chat stanza: ", stanza);

    let { id, from } = stanza.attrs;
    let body = '';
    let sender = from.split("/")[0];
    let timestamp = this.getTimestamp();
    from = from.split("/")[0];

    stanza.children.forEach((child) => {
      if ((typeof child !== 'string') && child.name === "body") body = child.children[0].toString();
    });

    let payload : ChatPayload = {
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

    await this.sendChatAck(stanza);
  }

  processMessageReaction(stanza: stanzaElem) {
    let jid = stanza.attrs.from.split("/")[0];
    let reactionId = stanza.getChild("reactions")!.attrs.id;
    let isRemoveReq = stanza.getChild("reactions")!.children.length === 0;
    let reactedby;
    let emoji;

    if (!isRemoveReq) {
      emoji = stanza.getChild("reactions")!.getChild("reaction")!.children[0];
      reactedby = stanza.attrs.from.split("/")[0];
      this._dispatcher
        .actionsDispatcher()
        .updateReaction({ reactedby, reactionId, jid, emoji });
    } else {
      this._dispatcher
        .actionsDispatcher()
        .removeReaction({ reactionId, jid, removedby: jid });
    }
  }

  processMessageAck(stanza: stanzaElem) {
    stanza.children.forEach((child) => {
      let id: string = '';

      if((typeof child !== 'string'))
        id = child.attrs.id; 

      if (id !== '' && (typeof child !== 'string')) {
        this._logger.info(
          `message delivered: id ${child.attrs.id} `
        );
        this._dispatcher
          .actionsDispatcher()
          .updateDeliveredMessage({ id });
      }
    });
  }

  processGroupMessage(stanza: stanzaElem) {
    // console.log("Group Message Stanza: ", stanza);
    let { id, from } = stanza.attrs;
    let gid: string = from;
    let groupName = gid.split("@")[0];
    let timestamp : string = this.getTimestamp();
    let body= '';
    from = from.split("/")[0];

    stanza.children.forEach((child) => {
      if (typeof child !== 'string' && child.name === "body") body = child.children[0].toString();
    });

    const payload : GroupChatPayload= {
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

    // this.sendChatAck(stanza);
  }

  /* --- remove the 'setGroupCreated()' dispatch once 'roomCreationResultIQ' is used --- */
  async acceptDefaultRoomConfig(stanza: stanzaElem) {
    let subject = stanza.attrs.from.split("@")[0];
    await this.xepList().createInstantRoom(subject);
    /* This has to be done when you receive a IQ Result and not here */
    this._dispatcher.actionsDispatcher().setGroupCreated(true);
  }

  async submitPreConfigRoomIQ(stanza: stanzaElem){
    let subject = stanza.attrs.from.split("@")[0];
    await this.xepList().createConfiguredRoom(subject);
  }

  async acceptDirectInvitation(stanza: stanzaElem) {
    let { id, from } = stanza.attrs;
    let gid = stanza.getChild("x")!.attrs.jid;
    let groupName = gid.split('@')[0];
    let payload : GroupChatPayload = {
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

    // console.log('attempting to send group presence to gid: ', gid);
    await this.sendGroupPresence(gid);
    this._dispatcher
      .actionsDispatcher()
      .newGroupMessage(payload);
  }

  isCreateRoomAck(presence: stanzaElem){
    let child = presence?.getChild('x', "http://jabber.org/protocol/muc#user");
    let xChildren = child && child.getChildren('status')
    let status_Els = xChildren?.filter(child => child.name === 'status');
    let STATUS_CODES: boolean[] = [];

    status_Els?.forEach(s => {
      let { code } = s.attrs;

      // console.log(`code: `, code);
      if(code === '201' || code === '110'){
        STATUS_CODES.push(true);
      }
    });
    
    if(STATUS_CODES[0] === true && STATUS_CODES[1] === true) return true;
    else return false;
  }

  isGroupPresence(presence : stanzaElem){
    return presence.attrs.from.includes('@conference');
  }

  roomCreationResultIQ(room_result: stanzaElem){
    console.log(room_result);
    this._dispatcher.actionsDispatcher().setGroupCreated(true);
  }
}