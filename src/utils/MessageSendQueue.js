import XmppClient from '../xmpp/client.js'
import _store from '../store/store';

let credential = _store.getState().auth.credential;
// FIFO MESSAGE SEND QUEUE

class MessageSendQueue{
	static mq = [];
	static isFree = true;
	static online = false;

	static add(payload){
		this.mq.push(payload);

		if(this.isFree)
			this.send();
	}

	static removeHead(){
		let shiftedElement = this.mq.shift();
		console.log({shiftedElement});
	}

	static onNetworkChange(status){
		this.online = status;
	}

	static tryAgain(){
		setTimeout(()=>{
			console.log('%c trying to send again.....', 'color: orange; font-size: 0.75rem;');
			console.log('Messages in Queue: ', this.mq.length);
			this.send();
		}, 2500);
	}

	static async send(){
		if(this.mq.length === 0){
			return;
		}

		if(!XmppClient.isReady()){
			this.tryAgain();
			return;
		}

		this.isFree = false;
		console.log('Sending Message: ', this.mq[0]);

		XmppClient.sendMessage(this.mq[0].senderjid, this.mq[0].message);
		//Also update redux state with message sent : true;
		this.removeHead();

		if(this.mq.length > 0) this.tryAgain(); 
		this.isFree = true;
	}
}

export default MessageSendQueue;