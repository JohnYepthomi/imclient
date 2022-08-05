export default function incomingStanzaHandler(stanza) {
  let _stanzaServiceContext = this;

  routeStanza(stanza);

  function routeStanza(stanza) {
    if (stanza.is("presence")) presenceHandler(stanza);
    else if (stanza.is("message")) mesageHandler(stanza);
    else iqHandler(stanza);
  }

  /* Handlers */
  function presenceHandler(stanza) {
    console.log("incoming stanza handler presenceHandler called...");
    if (!stanza.attrs.hasOwnProperty("type")) {
      //_stanzaServiceContext._dispatcher.actionsDispatcher().updateOnlineUsers();
      _stanzaServiceContext._logger.info(`Available Presence: ${stanza}`);
    } else if (stanza.attrs.type === "unavailable") {
      //_stanzaServiceContext._dispatcher.actionsDispatcher().updateOfflineUsers();
      _stanzaServiceContext._logger.info(`Unavailable Presence: ${stanza}`);
    }
  }

  function mesageHandler(stanza) {
    console.log("incoming - messageHandler called...");

    let { type, id } = stanza.attrs;

    if (type === "chat") {
      let isReactionMsg = stanza.children.some(
        (child) => child.name === "reactions"
      );

      if (isReactionMsg) reactionsResolver(stanza);
      else chatResolver(stanza);
      return;
    }

    if (id === "message-ack") {
      if (stanza.children.some((child) => child.name === "received"))
        ackResolver(stanza);

      return;
    }

    if (type === "groupchat") {
      mucResolver(stanza);
      return;
    }
  }

  function iqHandler(stanza) {
    console.log("iq-stanza: ", stanza);
  }

  /* Resolvers */
  function chatResolver(stanza) {
    console.log("chatResolver called...");
    let { id, from } = stanza.attrs;
    let stamp = _stanzaServiceContext.getTimestamp();
    let sent = undefined;
    let delivered = undefined;
    let isClientMessage = false;
    let body;
    from = from.split("/")[0];

    stanza.children.forEach((child) => {
      if (child.name === "body") body = child.children[0];
    });

    let payload = {
      id,
      from,
      body,
      stamp,
      sent,
      delivered,
      isClientMessage,
    };

    _stanzaServiceContext._dispatcher
      .actionsDispatcher()
      .newDirectMessage(payload);
    _stanzaServiceContext._dispatcher
      .actionsDispatcher()
      .updateLastMessage(payload);

    _stanzaServiceContext.sendChatAck(stanza);
  }

  function reactionsResolver(stanza) {
    console.log({ stanza });
    let jid = stanza.attrs.from;
    let emoji = stanza.getChild("reactions").getChild("reaction").children[0];
    let reactionId = stanza.getChild("reactions").attrs.id;
    let reactedby = stanza.attrs.from.split('/')[0];

    _stanzaServiceContext._dispatcher
      .actionsDispatcher()
      .updateReaction({ reactedby, reactionId, jid, emoji });
  }

  function ackResolver(stanza) {
    console.log("ackResolver called...");
    stanza.children.forEach((child) => {
      let { id } = child.attrs;
      if (id) {
        _stanzaServiceContext._logger.info(
          `message delivered: id ${child.attrs.id} `
        );
        _stanzaServiceContext._dispatcher
          .actionsDispatcher()
          .updateDeliveredMessage({ id });
      }
    });
  }

  function mucResolver(stanza) {
    _stanzaServiceContext._logger.info("Group Message Stanza: ", stanza);
    // _stanzaServiceContext._dispatcher.actionsDispatcher().newGroupMessage();
  }
}
