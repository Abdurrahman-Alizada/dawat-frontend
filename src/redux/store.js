import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user/user';
import groupReducer from './reducers/groups/groups';
import taskReducer from './reducers/tasks';
import chatReducer from './reducers/groups/chat/chatSlice';
import invitationSlice from './reducers/groups/invitations/invitationSlice';

import {api} from './reducers/groups/invitations/invitaionThunk';
import {groupApi} from './reducers/groups/groupThunk';

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupReducer,
    tasks: taskReducer,
    chat: chatReducer,
    invitations: invitationSlice,
    [api.reducerPath]: api.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
  },

  middleware: getdefaultMiddleware =>
    getdefaultMiddleware({
      serializableCheck: false,
    }).concat([api.middleware, groupApi.middleware]),
});
