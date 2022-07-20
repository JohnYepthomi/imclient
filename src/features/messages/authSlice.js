import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import XmppClient from '../../xmpp/client.js';
import StorageLocal from '../../utils/storage.js'

let savedCredentials = StorageLocal.parseItem('credentials');
let savedLoggedOut = StorageLocal.getItem('loggedOut');

export const authSlice = createSlice({
  name: 'authentication',

  initialState: {
    credential: savedCredentials || [],
    activeClient: false,
    loggedOut: savedLoggedOut === 'false' ? false : true
  },

  reducers: {
    logout: (state, action) =>{
      state.loggedOut = action.payload;
      
    },

    saveCredential: (state, action) =>{
      state.credential[0] = {username: action.payload.usernanme, password: action.payload.password};
    }
  },

  extraReducers: (builder) =>{
    builder.addCase(authenticateUser.fulfilled, (state, action) => {
      state.activeClient = action.payload;
    })
  }
});

export const authenticateUser = createAsyncThunk( 'authentication/authenticateUser', async (credentials, thunkAPI) => {
  let username = credentials.username;
  let password = credentials.password;
  let response = await XmppClient.initXmpp({username, password});
  StorageLocal.stringifyItem('credentials', [{username, password}]);

    return response;
  }
);

export const { logout, saveCredential  } = authSlice.actions;
export default authSlice.reducer;