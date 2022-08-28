import xml from "@xmpp/xml";
import { Element as stanzaElem } from "@xmpp/xml";

/** ---------------- STANA_SERVICE_TYPES ------------------------ */

export interface StanzaServiceInterface{
  attachMod: (xepMod: XepModule, sendQueue: SendQueue ) => void;
  sendPresence: (type: string) => void;
  sendGroupPresence: (gid: string) => void;
  sendChat: ({jid, body}: {jid: string, body: string}) => void;
  sendGroupChat: ({gid, body, groupName} : {gid: string, body: string, groupName: string}) => void;
  sendReaction: ({reactionId, reactedby, sender, emoji}: {reactionId: string; reactedby: string; sender: string; emoji: string})=>void;
  removeReaction: ({reactionId, to}:{reactionId: string; to: string}) => void;
  sendXep: (stanza: stanzaElem)=>void;
  send: (stanza: stanzaElem) => void;
  sendChatAck: (stanza: stanzaElem) => void;
  xepList: ()=> void;
  generateId: (length: number) => void;
  getTimestamp: ()=> void;
}
export type xmlType = typeof xml;
export type SendQueue = {
    add: (payload: stanzaElem) => void;
};
export type ChatPayload = {
id: string;
from: string;
body: string;
timestamp: string;
sender: string;
delivered?: boolean;
sent?: boolean;
reactions?: [
    { emoji: string; reactors: string[]; count?: number }
];
};
export type GroupChatPayload = {
id: string;
gid: string;
from: string;
body: string;
groupName: string;
timestamp: string;
reactions?: {};
delivered?: boolean | undefined;
sent?: boolean | undefined;
joinEvent?: boolean;
createEvent?: boolean;
};
export type XepModule = {
[key : string]: (a: string)=> void;
}

/**----------------- DISPATCHER_TYPES ----------------------- */

export interface DispatcherServiceType{
  actionsDispatcher: () => void;
}
export type CustomAction = (payload: object| boolean) => void;
export type CustomActionObject = { [key: string]: CustomAction };

/**------------------ LOGGER_SERVICE_TYPES ----------------------------*/

export type LoggerObjectType = {
  info: (message: string)=> void;
  error: (message: string)=>void;
}
export type LogServiceType = (scope: string, color: string) => LoggerObjectType;

