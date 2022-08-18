export default function incomingStanzaHandler(stanza) {
  let _stanzaServiceContext = this;

  routeStanza(stanza);

  function routeStanza(stanza) {
    stanza.is("presence") && presenceHandler(stanza);
    stanza.is("message") && mesageHandler(stanza);
    stanza.is("iq") && iqHandler(stanza);
  }

  /* Handlers */
  function presenceHandler(stanza) {
    console.log("presence stanza", stanza);

    const { type, id } = stanza.attrs;
    const HAVE_TYPE = stanza.attrs.hasOwnProperty("type");

    if (id !== "request-new-muc" && !HAVE_TYPE) {
      //_stanzaServiceContext._dispatcher.actionsDispatcher().updateOnlineUsers();
      _stanzaServiceContext._logger.info(`Available Presence: ${stanza}`);
    } else if (type === "unavailable") {
      //_stanzaServiceContext._dispatcher.actionsDispatcher().updateOfflineUsers();
      _stanzaServiceContext._logger.info(`Unavailable Presence: ${stanza}`);
    } else if (id === "request-new-muc") {
      instantMucResovler(stanza);
    }
  }

  function mesageHandler(stanza) {
    let { type, id } = stanza.attrs;
    console.log("message stanza: ", stanza);
    if (type === "chat") {
      let isReactionMsg = stanza.children.some(
        (child) => child.name === "reactions"
      );

      if (isReactionMsg) reactionsResolver(stanza);
      else chatResolver(stanza);
      return;
    } else if (id === "message-ack") {
      if (stanza.children.some((child) => child.name === "received"))
        ackResolver(stanza);

      return;
    } else if (type === "groupchat") {
      groupChatResolver(stanza);
      return;
    } else if (id === "direct-invitation") {
      directInvitationResolver(stanza);
    }
  }

  function iqHandler(stanza) {
    console.log("iq-stanza: ", stanza);
  }

  /* Resolvers */
  function chatResolver(stanza) {
    console.log("chat stanza: ", stanza);

    let { id, from } = stanza.attrs;
    let body;
    let sender = from.split("/")[0];
    let timestamp = _stanzaServiceContext.getTimestamp();
    from = from.split("/")[0];

    stanza.children.forEach((child) => {
      if (child.name === "body") body = child.children[0];
    });

    let payload = {
      id,
      from,
      body,
      sender,
      timestamp,
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
    let jid = stanza.attrs.from.split("/")[0];
    let reactionId = stanza.getChild("reactions").attrs.id;
    let isRemoveReq = stanza.getChild("reactions").children.length === 0;
    let reactedby;
    let emoji;

    if (!isRemoveReq) {
      emoji = stanza.getChild("reactions").getChild("reaction").children[0];
      reactedby = stanza.attrs.from.split("/")[0];
      _stanzaServiceContext._dispatcher
        .actionsDispatcher()
        .updateReaction({ reactedby, reactionId, jid, emoji });
    } else {
      _stanzaServiceContext._dispatcher
        .actionsDispatcher()
        .removeReaction({ reactionId, jid, removedby: jid });
    }
  }

  function ackResolver(stanza) {
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

  function groupChatResolver(stanza) {
    _stanzaServiceContext._logger.info("Group Message Stanza: ", stanza);
    console.log("Group Message Stanza: ", stanza);
    // _stanzaServiceContext._dispatcher.actionsDispatcher().newGroupMessage();
  }

  async function instantMucResovler(stanza) {
    let subject = stanza.attrs.from.split("@")[0];
    let gid = stanza.attrs.from;
    await _stanzaServiceContext.xepList().createInstantRoom(subject);
    /* This has to be done when you receive a IQ Result and not here */
    _stanzaServiceContext._dispatcher.actionsDispatcher().setGroupCreated(true);
  }

  function directInvitationResolver(stanza) {
    let { id, from } = stanza.attrs;
    let gid = stanza.getChild("x").attrs.jid;
    let payload = {
      id,
      gid,
      from,
      body: "na",
      timestamp: _stanzaServiceContext.getTimestamp(),
      delivered: undefined,
      sent: undefined,
      createEvent: true,
      joinEvent: false,
    };

    _stanzaServiceContext._dispatcher
      .actionsDispatcher()
      .newGroupMessage(payload);
  }
}
