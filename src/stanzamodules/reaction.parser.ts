import { Element as stanzaElem } from "@xmpp/xml";

class ReactionParser{
    constructor(){}
    // processMessageReaction(stanza: stanzaElem) {
    //     let jid = stanza.attrs.from.split("/")[0];
    //     let reactionId = stanza.getChild("reactions")!.attrs.id;
    //     let isRemoveReq = stanza.getChild("reactions")!.children.length === 0;
    //     let reactedby;
    //     let emoji;
    
    //     if (!isRemoveReq) {
    //       emoji = stanza.getChild("reactions")!.getChild("reaction")!.children[0];
    //       reactedby = stanza.attrs.from.split("/")[0];
    //       this._dispatcher
    //         .actionsDispatcher()
    //         .updateReaction({ reactedby, reactionId, jid, emoji });
    //     } else {
    //       this._dispatcher
    //         .actionsDispatcher()
    //         .removeReaction({ reactionId, jid, removedby: jid });
    //     }
    // }
}