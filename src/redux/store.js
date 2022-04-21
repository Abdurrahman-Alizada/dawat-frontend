import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import groupReducer from './groups'
export const store = configureStore({
  reducer: {
    user: userReducer,
    groups : groupReducer
  },
})