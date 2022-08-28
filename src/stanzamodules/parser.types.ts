import { Element as stanzaElem } from "@xmpp/xml";

export interface ChatParserInterface {
    routeStanza: (stanza: stanzaElem)=> void
}

export interface GroupParserInterface {
    routeStanza: (stanza: stanzaElem) => void;
    processGroupMessage: () => void;
    isCreateRoomAck: () => void;
    submitPreConfigRoom: () => void;
    acceptDirectInvitation: () => void;
    isGroupPresence: () => void;
    roomCreationResultIQ: () => void;
    acceptDefaultRoomConfig: () => void;
    processMessageAck: () => void;
}

export interface ReactionParserInterface{
    processMessageReaction: (stanza: stanzaElem) => void;
}