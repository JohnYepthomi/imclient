import React from 'react';
import { Routes, Route} from "react-router-dom";
import {Login, Conversation, MessagesList, Contacts, Status} from  './components'
import Home from './container/home';
import store from './store/store'
import { Provider } from 'react-redux';
import { PrivateRoute } from './auth/PrivateRouter';

export default function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route exact path="/" element={<PrivateRoute/>}>
          <Route exact path="/" element={<Home />}>
            <Route index={true} element={<MessagesList />}/>
            <Route path="status" element={<Status />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="conversation/:senderjid" element={<Conversation />}/>
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </Provider>
  );
}