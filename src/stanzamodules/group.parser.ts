import { Element as stanzaElem } from "@xmpp/xml";
import {xmlType, SendQueue, XepModule, ChatPayload, GroupChatPayload } from '../services/types';

class GroupParser{
    constructor(){}

    routeStanza(stanza: stanzaElem){
      stanza.is('presence')
        ? this.filterGroupPresence(stanza)
      : stanza.is('message')
        ? this.filterGroupMessage(stanza)
      : stanza.is('iq')
        ? this.filterGroupIQ(stanza)
      : 'this will never be executed';
    }

    /*       => [Start] =>         */

    filterGroupPresence(presence: stanzaElem){
      const CREATE_ROOM_SUCCESS: boolean = this.isCreateRoomSuccess(presence);
      const { type } = presence.attrs;

      if(CREATE_ROOM_SUCCESS){
        this.acceptDefaultRoomConfig(presence);
        // this.submitPreConfigRoomIQ(stanza);
        return;
      }

      if(type === 'error'){
        this.presenceError(presence);
      }
    }
    
    filterGroupIQ(iq: stanzaElem){
      const { type } = iq.attrs;

      if(type === 'result') this.roomCreationResultIQ(iq);
      else if(type === 'error') this.iqError(iq);
    }
    
    filterGroupMessage(groupMessage: stanzaElem){
      let { type, id } = groupMessage.attrs;

      if (type === "groupchat") {
        this.processGroupMessage(groupMessage);
        return;
      }

      if (id === "direct-invitation-req") {
        this.acceptDirectInvitation(groupMessage);
        return;
      }
    }

    /*       =>  [End]  =>         */

    presenceError(error: stanzaElem){
      console.log(error);
      
    }

    iqError(iq: stanzaElem){}

    processGroupMessage(groupMessage: stanzaElem) {
        // console.log("Group Message Stanza: ", stanza);
        let { id, from } = groupMessage.attrs;
        let gid: string = from;
        let groupName = gid.split("@")[0];
        let timestamp : string = this.getTimestamp();
        let body= '';
        from = from.split("/")[0];
    
        groupMessage.children.forEach((child) => {
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

    isCreateRoomSuccess(presence: stanzaElem){
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

    async submitPreConfigRoomIQ(presence: stanzaElem){
        let subject = presence.attrs.from.split("@")[0];
        await this.xepList().createConfiguredRoom(subject);
    }

    async acceptDirectInvitation(groupMessage: stanzaElem) {
    let { id, from } = groupMessage.attrs;
    let gid = groupMessage.getChild("x")!.attrs.jid;
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

    isGroupPresence(presence : stanzaElem){
        return presence.attrs.from.includes('@conference');
    }

    roomCreationResultIQ(iq: stanzaElem){
        console.log(iq);
        this._dispatcher.actionsDispatcher().setGroupCreated(true);
    }

    async acceptDefaultRoomConfig(presence: stanzaElem) {
        let subject = stanza.attrs.from.split("@")[0];
        await this.xepList().createInstantRoom(subject);
        /* This has to be done when you receive a IQ Result and not here */
        this._dispatcher.actionsDispatcher().setGroupCreated(true);
    }

    /* Same as 'processMessageAck' in ChatParser Class method and May require changes */
    processMessageAck(groupMessage: stanzaElem) {
        groupMessage.children.forEach((child) => {
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