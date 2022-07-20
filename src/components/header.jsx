import React from 'react';
import '../styles/header.css';
import {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [activeTab, setActiveTab] = useState('Messages');

  const handelTabClick = (e) => {
    if(e.target.innerText === "CHATS")
      setActiveTab('Messages')
    if(e.target.innerText === "STATUS")
      setActiveTab('Status')
    if(e.target.innerText === "CONTACTS")
      setActiveTab('Contacts')
  }

  useEffect(()=>{
    //
  },[])

  return (
    <div className='main-header'>
      <div className='branding'> 
        <div className='brand-name'>Whasup</div>
        <div className='branding-buttons'>
          <div className='search'>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="white" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>

          <div className='more'>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="white" className="bi bi-three-dots" viewBox="0 0 16 16">
              <path  d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="menu">
        <div className="menu-item" draggable={false} active={(activeTab === 'Messages') ? "true" : "false"} onClick={handelTabClick}>
          <Link to="/">
            <div>CHATS</div>
          </Link>
        </div>

        <div className="menu-item" active={activeTab === 'Status' ? "true" : "false"} onClick={handelTabClick}>
          <Link to="/status">
            <div>STATUS</div>
          </Link>
        </div>
      
        <div className="menu-item" active={activeTab === 'Contacts' ? "true" : "false"} onClick={handelTabClick}>
          <Link to="/contacts">
            <div>CONTACTS</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
