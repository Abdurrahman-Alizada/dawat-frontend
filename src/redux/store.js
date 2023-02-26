import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/user/user';
import groupReducer from './reducers/groups/groups';
import taskReducer from './reducers/groups/tasks/taskSlice';
import chatReducer from './reducers/groups/chat/chatSlice';
import invitationSlice from './reducers/groups/invitations/invitationSlice';
import friendshipSlice from './reducers/Friendship/friendshipSlice';

import {InvitaionsApi} from './reducers/groups/invitations/invitaionThunk';
import {groupApi} from './reducers/groups/groupThunk';
import {TasksApi} from './reducers/groups/tasks/taskThunk';
import {userApi} from './reducers/user/userThunk';
import {friendshipApi} from './reducers/Friendship/friendshipThunk';
import {ChatApi} from './reducers/groups/chat/chatThunk';

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups: groupReducer,
    tasks: taskReducer,
    chat: chatReducer,
    invitations: invitationSlice,
    friendship: friendshipSlice,
    [InvitaionsApi.reducerPath]: InvitaionsApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [TasksApi.reducerPath]: TasksApi.reducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [friendshipApi.reducerPath]: friendshipApi.reducer,
  },

  middleware: getdefaultMiddleware =>
    getdefaultMiddleware({
      serializableCheck: false,
    }).concat([
      InvitaionsApi.middleware,
      groupApi.middleware,
      TasksApi.middleware,
      userApi.middleware,
      friendshipApi.middleware,
      ChatApi.middleware
    ]),
});
