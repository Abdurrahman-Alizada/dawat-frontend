import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user/user';
import groupReducer from './reducers/groups/groups';
import taskReducer from './reducers/tasks';
import chatReducer from './reducers/groups/chat/chatSlice';
import invitationSlice from './reducers/groups/invitations/invitationSlice';

import {InvitaionsApi} from './reducers/groups/invitations/invitaionThunk';
import {groupApi} from './reducers/groups/groupThunk';
import { TasksApi } from './reducers/groups/tasks/taskThunk';

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupReducer,
    tasks: taskReducer,
    chat: chatReducer,
    invitations: invitationSlice,
    [InvitaionsApi.reducerPath]: InvitaionsApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [TasksApi.reducerPath]: TasksApi.reducer,
  },

  middleware: getdefaultMiddleware =>
    getdefaultMiddleware({
      serializableCheck: false,
    }).concat([InvitaionsApi.middleware, groupApi.middleware, TasksApi.middleware]),
});
