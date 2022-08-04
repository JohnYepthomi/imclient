/**
 * @Requries {Object} xmpp connected Object
 * @Currently it depends on Stanza Service to send Stanzas
 */

export default class XepModule {
  constructor(stanzaService, logService) {
    this._logger = logService("xepModule -> ", "aqua");
    this._stanzaService = stanzaService;
  }

  async setClientAvatar() {
    // let iq_set_vcard = new this._stanzaService._xml.Element('iq', {from: 'peter@localhost', type: 'set', id:'set-client-avatar'});
    // iq_set_vcard.c('vCard', {xmlns: "vcard-temp"})
    //     .c('PHOTO')
    //     .c('TYPE').t('image/png').up()
    //     .c('BINVAL').t(clientAvatarBase64);
    //await this._stanzaService.sendXep(iq_set_vcard);
  }

  async getClientAvatar() {
    let iq_get_vcard = new this._stanzaService._xml.Element("iq", {
      from: "peter@localhost",
      type: "get",
      id: "get-client-avatar",
    });
    iq_get_vcard.c("vCard", { xmlns: "vcard-temp" });
    await this._stanzaService.sendXep(iq_get_vcard);
  }

  async joinGroup(roomname = "friends") {
    let iq_join_muc = new this._stanzaService._xml.Element("presence", {
      from: "samuel@localhost",
      to: `${roomname}@conference.localhost/samharris`,
      id: "join-muc",
    });
    iq_join_muc.c("x", { xmlns: "http://jabber.org/protocol/muc" });
    await this._stanzaService.sendXep(iq_join_muc);
  }

  async createInstantRoom(params) {
    let { roomname, nickname } = params;
    let iq_join_muc = new this._stanzaService._xml.Element("presence", {
      to: `${roomname}@conference.localhost/${nickname}`,
      id: "create-instant-muc",
    });
    iq_join_muc.c("x", { xmlns: "http://jabber.org/protocol/muc" });
    await this._stanzaService.sendXep(iq_join_muc);
  }

  async createConfigurableRoom() {
    // <iq from='crone1@shakespeare.lit/desktop'
    //     id='create1'
    //     to='coven@chat.shakespeare.lit'
    //     type='get'>
    //   <query xmlns='http://jabber.org/protocol/muc#owner'/>
    // </iq>

    let iq_configurable_room = new this._stanzaService._xml.Element("iq", {
      type: "get",
    });
    iq_configurable_room.c("query", {
      xmlns: "http://jabber.org/protocol/muc#owner",
    });

    await this._stanzaService.sendXep(iq_configurable_room);
  }

  async getLastActivity() {}
}
