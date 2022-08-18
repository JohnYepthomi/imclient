/**
 * @Requries {Object} xmpp connected Object
 * @Currently it depends on Stanza Service to send Stanzas
 */

export default class XepModule {
  constructor(stanzaService, logService) {
    this._logger = logService("xepModule -> ", "aqua");
    this._stanzaService = stanzaService;
    this._xml = this._stanzaService._xml;
  }

  async setClientAvatar() {
    // let iq_set_vcard = new this._xml.Element("iq", {
    //   from: "peter@localhost",
    //   type: "set",
    //   id: "set-client-avatar",
    // });
    // iq_set_vcard
    //   .c("vCard", { xmlns: "vcard-temp" })
    //   .c("PHOTO")
    //   .c("TYPE")
    //   .t("image/png")
    //   .up()
    //   .c("BINVAL")
    //   .t(clientAvatarBase64);
    // await this._stanzaService.sendXep(iq_set_vcard);
  }

  async setGroupAvatar(roomname, nickname, b64img) {
    let iq_set_vcard = new this._xml.Element("iq", {
      type: "set",
      id: "set-group-avatar",
      to: `${roomname}@conference.localhost/${nickname}`,
    });
    iq_set_vcard
      .c("vCard", { xmlns: "vcard-temp" })
      .c("PHOTO")
      .c("TYPE")
      .t("image/png")
      .up()
      .c("BINVAL")
      .t(b64img);
    await this._stanzaService.sendXep(iq_set_vcard);
  }

  async getClientAvatar() {
    let iq_get_vcard = new this._xml.Element("iq", {
      type: "get",
      id: "get-client-avatar",
    });
    iq_get_vcard.c("vCard", { xmlns: "vcard-temp" });
    await this._stanzaService.sendXep(iq_get_vcard);
  }

  async requestNewRoom(roomName, nickname) {
    console.log("xep() request New Room called()");
    let iq_join_muc = new this._xml.Element("presence", {
      to: `${roomName}@conference.localhost/${nickname}`,
      id: "request-new-muc",
    });
    iq_join_muc.c("x", { xmlns: "http://jabber.org/protocol/muc" });
    await this._stanzaService.sendXep(iq_join_muc);
  }

  async createInstantRoom(subject) {
    console.log("xep() createInstantRoom called()");
    let iq_instant_muc = this._xml(
      "iq",
      {
        to: `${subject}@conference.localhost`,
        id: "create-instant-muc",
        type: "set",
      },
      this._xml(
        "query",
        {
          xmlns: "http://jabber.org/protocol/muc#owner",
        },
        this._xml("x", {
          xmlns: "jabber:x:data",
          type: "submit",
        })
      )
    );

    console.log({ iq_instant_muc });

    await this._stanzaService.sendXep(iq_instant_muc);
  }

  async sendDirectInvitations(gid) {
    console.log("direct invitation  XEP called()");

    const gidWithoutNick = gid.split("/")[0];
    const subject = gid.split("@")[0];
    let allGroupParticipants = this._stanzaService._store.getState().messages
      .groupParticipants;
    let participantsList = allGroupParticipants.filter(
      (p) => p[subject] !== null || p[subject] !== undefined
    );

    participantsList.forEach((record) => {
      record[subject].forEach(async (participant) => {
        let stanza = this._xml(
          "message",
          { to: participant, id: "direct-invitation" },
          this._xml("x ", {
            xmlns: "jabber:x:conference",
            jid: gidWithoutNick,
          })
        );

        console.log("invitationStanza: ", stanza);

        await this._stanzaService.send(stanza);
      });
    });
  }

  async createConfigurableRoom() {
    // <iq from='crone1@shakespeare.lit/desktop'
    //     id='create1'
    //     to='coven@chat.shakespeare.lit'
    //     type='get'>
    //   <query xmlns='http://jabber.org/protocol/muc#owner'/>
    // </iq>

    let iq_configurable_room = new this._xml.Element("iq", {
      type: "get",
    });
    iq_configurable_room.c("query", {
      xmlns: "http://jabber.org/protocol/muc#owner",
    });

    await this._stanzaService.sendXep(iq_configurable_room);
  }

  async getLastActivity() {}
}
