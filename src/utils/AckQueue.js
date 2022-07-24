class AckQueue {
  static mq = [];

  static add(msg) {
    this.mq.push(msg);
    console.log(this.mq);
  }

  static get(jid) {
    let targetAck;

    this,
      (mq = this.mq.map((m, index) => {
        if (m[index][jid]) targetAck = m[index][jid];
        else return m;
      }));

    console.log(targetAck);
    console.log(this.mq);

    return targetAck;
  }
}

export default AckStore;
