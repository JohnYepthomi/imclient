import { Element as stanzaElem } from "@xmpp/xml";
import React from "react";
import { ChatPayload, StanzaService } from '../services/types';
import { ChatParserInterface, ReactionParserInterface } from './parser.types';

class ChatParser implements ChatParserInterface{
    public StanzaService : StanzaService;
    public ReactionParser;
    public Dispatcher;

    constructor(StanzaService, ReactionParser, Dispatcher){
      this.StanzaService =StanzaService;
      this.ReactionParser = ReactionParser;
      this.Dispatcher = Dispatcher;
    }

    routeStanza(stanza: stanzaElem){
        stanza.is('message') && this.messageHandler(stanza);
    }

    messageHandler(stanza: stanzaElem) {
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
    }
      
    async processChatMessage(stanza: stanzaElem) {
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
}