import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user/user';
import groupReducer from './reducers/groups/groups';
import taskReducer from './reducers/tasks';
import chatReducer from './reducers/groups/chat/chatSlice';
import invitationSlice from './reducers/groups/invitations/invitationSlice';

import {api} from './reducers/groups/invitations/invitaionThunk';

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupReducer,
    tasks: taskReducer,
    chat: chatReducer,
    invitations: invitationSlice,
    [api.reducerPath]: api.reducer,
  },

  middleware: getdefaultMiddleware =>
    getdefaultMiddleware({
      serializableCheck: false,
    }).concat([api.middleware]),
});
