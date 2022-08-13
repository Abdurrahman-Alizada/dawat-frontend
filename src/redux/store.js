import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import groupReducer from './groups'
import taskReducer from './tasks'
import chatReducer from './chat'

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