import React from 'react';
import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../styles/messagesList.css';
import { useSelector, useDispatch } from 'react-redux';

export default function MessagesList() {
  const [messages, setMessages] = useState();
  const newMessage = useSelector(state => state.messages.lastMessage);
  
  function getDayFromTimestamp(timestamp){
    const m_d_y = timestamp.split(' ')[0].split('/'); //temporary dummy timestamp; needs changes when using real data;
    const messageDate = new Date(m_d_y);
    const currentdate = new Date().getDate();
    const diffTime = Math.abs(currentdate - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if(diffDays > 1){
      return timestamp.split(' ')[0];
    }else if(diffDays === 0){
      return 'Today';
    }else if(diffDays === 1){
      return 'Yesterday'
    }
  }

  useEffect(()=>{
    let msgs = [
      {
        jid: 'samuel@localhost',
        chat: 'Yes, im avail now!!',
        type: 'direct-message',
        timestamp: '06/23/2022 12:56 P.M',
        avatar: 'https://picsum.photos/400'
      },
      {
        jid: 'pratick@localhost',
        chat: 'Yes, im avail now!!',
        type: 'direct-message',
        timestamp: '06/12/2022 12:56 P.M',
        avatar: 'https://picsum.photos/300'
      },
      {
        jid: 'shashank@localhost',
        chat: 'Yes, im avail now!!',
        type: 'direct-message',
        timestamp: '03/12/2022 12:56 P.M',
        avatar: 'https://picsum.photos/200'
      },
      {
        jid: 'peter@localhost',
        chat: 'Yes, im avail now!!',
        type: 'direct-message',
        timestamp: '03/26/2022 12:56 P.M',
        avatar: 'https://picsum.photos/100'
      }
    ]

    setMessages(msgs);
  }, [newMessage]);
  

  return (
    <div className="messages-container">
      <ul className="messages-list">
        {
          messages && messages.map((msg, index) => {
            return (
              <Link 
                to={`conversation/${msg.jid.split('/')[0]}?source=chats`} key={index}>
                <li  jid={msg.jid}>
                  <div className='message-sender-container'>
                    <img src={msg.avatar} alt="sender avatar"/>
                    <div className='flex-row-container'>
                      <div className="sender-name">{msg.jid.split('@')[0]}</div>
                      {newMessage.length > 0 
                        && newMessage.map((message, index)=>{
                          if(message[msg.jid]){
                            return (
                              <div className='message-peek-container'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="limegreen" class="bi bi-chat-fill" viewBox="0 0 16 16">
                                  <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                                </svg>
                                
                                <div className="new-message-peek">
                                  {message[msg.jid].body}
                                </div>
                              </div>
                            )
                          }
                        })
                      }
                    </div>
                  </div>
                  <div className='buttons-container'>
                    <div className='last-chat-day'>{getDayFromTimestamp(msg.timestamp)}</div>
                    <div className='more-buttons'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="gray" className="bi bi-pin-angle-fill" viewBox="0 0 16 16">
                        <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
                      </svg>
                    </div>
                  </div>
                </li>
              </Link>
            )
          })
        }
      </ul>

      <div className="new-message-button">
        <Link to="/contacts">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" className="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
