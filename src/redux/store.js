import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user/user'
import groupReducer from './reducers/groups/groups'
import taskReducer from './reducers/tasks'
import chatReducer from './reducers/chat'

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups : groupReducer,
    tasks : taskReducer,
    chat : chatReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})