export default class XepModule {
  conferenceDomain = '@conference.localhost';

  constructor(stanzaService, logService) {
    this._logger = logService("xepModule -> ", "aqua");
    this._stanzaService = stanzaService;
    this._xml = stanzaService._xml;

    this.createConfiguredRoom();
  }

  // async setClientAvatar() {
  //   // let iq_set_vcard = new this._xml.Element("iq", {
  //   //   from: "peter@localhost",
  //   //   type: "set",
  //   //   id: "set-client-avatar",
  //   // });
  //   // iq_set_vcard
  //   //   .c("vCard", { xmlns: "vcard-temp" })
  //   //   .c("PHOTO")
  //   //   .c("TYPE")
  //   //   .t("image/png")
  //   //   .up()
  //   //   .c("BINVAL")
  //   //   .t(clientAvatarBase64);
  //   // await this._stanzaService.sendXep(iq_set_vcard);
  // }

  // async setGroupAvatar(roomname, nickname, b64img) {
  //   let iq_set_vcard = new this._xml.Element("iq", {
  //     type: "set",
  //     id: "set-group-avatar",
  //     to: `${roomname}@conference.localhost/${nickname}`,
  //   });
  //   iq_set_vcard
  //     .c("vCard", { xmlns: "vcard-temp" })
  //     .c("PHOTO")
  //     .c("TYPE")
  //     .t("image/png")
  //     .up()
  //     .c("BINVAL")
  //     .t(b64img);
  //   await this._stanzaService.sendXep(iq_set_vcard);
  // }

  // async getClientAvatar() {
  //   let iq_get_vcard = new this._xml.Element("iq", {
  //     type: "get",
  //     id: "get-client-avatar",
  //   });
  //   iq_get_vcard.c("vCard", { xmlns: "vcard-temp" });
  //   await this._stanzaService.sendXep(iq_get_vcard);
  // }

  async requestNewRoom(roomName, nickname) {
    console.log("xep() request New Room called()");
    let iq_join_muc = new this._xml.Element("presence", {
      to: `${roomName}@conference.localhost/${nickname}`,
      // id: "request-new-muc",
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
        id: "create-instant-room",
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

    await this._stanzaService.sendXep(iq_instant_muc);
  }

  async sendDirectInvitations(gid) {
    console.log("direct invitation  XEP called()");

    const gidWithoutNick = gid.split("/")[0];
    const subject = gid.split("@")[0];
    let allGroupParticipants = this._stanzaService._store.getState().messages.groupParticipants;
    let participantsList = allGroupParticipants.filter((p) => p[subject]);

    participantsList.forEach((record) => {
      record[subject].forEach(async (participant) => {
        let stanza = this._xml(
          "message",
          { to: participant, id: "direct-invitation-req" },
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

  async createConfiguredRoom(subject = 'test', description = 'Test Group Description', max_users = 10, moderated = true, members_only = false, use_password = false, secret = '', whois = 'moderator', max_history = 20, room_admins = '') {
    let iq_room_config = 
      this._xml('iq', {id: 'create-config-room', to: `${ subject + this.conferenceDomain }`, type: 'set'},
        this._xml('query', {xmlns: 'http://jabber.org/protocol/muc#owner'},
          this._xml('x', {xmlns:'jabber:x:data', type:'submit'},
            this._xml('field', {var: 'FORM_TYPE'}, this._xml('value',1)),
            this._xml('field', {var: 'muc#roomconfig_roomname'}, this._xml('value',{}, subject)), /* room name */
            this._xml('field', {var: 'muc#roomconfig_roomdesc'}, this._xml('value', {}, description)), /* room details */
            this._xml('field', {var: 'muc#roomconfig_enablelogging'}, this._xml('value', {}, 0)),
            this._xml('field', {var: 'muc#roomconfig_changesubject'}, this._xml('value', {}, 1)),
            this._xml('field', {var: 'muc#roomconfig_allowinvites'}, this._xml('value', {}, 0)),
            this._xml('field', {var: 'muc#roomconfig_allowpm'}, this._xml('value', {}, 'anyone')),
            this._xml('field', {var: 'muc#roomconfig_maxusers'}, this._xml('value', {}, max_users)),
            this._xml('field', {var: 'muc#roomconfig_publicroom'}, this._xml('value', {}, 0)),
            this._xml('field', {var: 'muc#roomconfig_persistentroom'}, this._xml('value', {}, 1)),
            this._xml('field', {var: 'muc#roomconfig_moderatedroom'}, this._xml('value', {}, moderated)),
            this._xml('field', {var: 'muc#roomconfig_membersonly'}, this._xml('value', {}, members_only)),
            this._xml('field', {var: 'muc#roomconfig_passwordprotectedroom'}, this._xml('value', {}, use_password)),
            this._xml('field', {var: 'muc#roomconfig_roomsecret'}, this._xml('value', {}, secret)),
            this._xml('field', {var: 'muc#roomconfig_whois'}, this._xml('value', {}, whois)),
            this._xml('field', {var: 'muc#maxhistoryfetch'}, this._xml('value', {}, max_history)),
            this._xml('field', {var: 'muc#roomconfig_roomadmins'}, this._xml('value', {}, room_admins))
          )
        )
      );
    await this._stanzaService.sendXep(iq_room_config);
  }

 xmlStringToXmlElement(xml_string){
  let div = document.createElement('div');
  div.innerHTML = xml_string;
  console.log(div.querySelector('iq'));
 }

  // async getLastActivity() {}
}
