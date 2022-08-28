import { Element as stanzaElem } from "@xmpp/xml";
import { ChatParser, GroupParser, ReactionParser } from './parser.types';

class DefultParser{
    private _cParser: ChatParser;
    private _gParser: GroupParser;
    private _rParser: ReactionParser;

    constructor(ChatParser: ChatParser, GroupParser: GroupParser, ReactionParser: ReactionParser){
        this._cParser = ChatParser;
        this._gParser = GroupParser;
        this._rParser = ReactionParser;
    }

    routeStanza(stanza: stanzaElem) {
        this._cParser.routeStanza(stanza);
        this._gParser.routeStanza(stanza);
        this._rParser.processMessageReaction(stanza);
    }
}