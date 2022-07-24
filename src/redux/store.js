import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import groupReducer from './groups'
import taskReducer from './tasks'

export const store = configureStore({
  reducer: {
    user: userReducer,
    groups : groupReducer,
    tasks : taskReducer
  },
})