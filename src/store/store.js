import { configureStore } from '@reduxjs/toolkit'
import messageReducer from '../features/messages/messageSlice';
import contactsReducer from '../features/messages/contactsSlice';
import authReducer from '../features/messages/authSlice';

export default configureStore({
  reducer: {
    messages: messageReducer,
    auth: authReducer,
    contacts: contactsReducer,
  }
});