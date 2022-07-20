import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components';
import XmppClient from '../xmpp/client.js';
import { xml } from '@xmpp/client';


export default function Home() {
  
  useEffect(() => {
    const handleTabClose = event => {
      event.preventDefault();
      XmppClient.gracefulExit();
      return (event.returnValue = 'Are you sure you want to exit?');
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}