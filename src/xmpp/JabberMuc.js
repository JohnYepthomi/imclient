class JabberMuc{

    static crateInstantgroup(room_name){
        let iq_join_muc = new xml.Element('presence', {to:`${room_name}@conference.localhost/peteParker`, id:'create-instant-muc'});
        iq_join_muc.c('x', {xmlns: "http://jabber.org/protocol/muc"});
        this.xmpp.send(iq_join_muc);
    }

    static createConfigurableGroup(room_name){
        let iq_join_muc = new xml.Element('presence', {to:`${room_name}@conference.localhost/peteParker`, id:'create-configurable-muc'});
        iq_join_muc.c('x', {xmlns: "http://jabber.org/protocol/muc"});
        this.xmpp.send(iq_join_muc);
    }

    static joinGroup(room_name){
        let iq_join_muc = new xml.Element('presence', {to:`${room_name}@conference.localhost/samharris`, id:'join-muc'});
        iq_join_muc.c('x', {xmlns: "http://jabber.org/protocol/muc"});
        this.xmpp.send(iq_join_muc);
    }

    static kickUser(){

    }

    static banUser(){

    }

    static changeUserRole(){

    }

    static changeUserPrivileges(){

    }

    static changeUserAffiliation(){

    }
}