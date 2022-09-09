import {createSlice} from '@reduxjs/toolkit';
import {registerUser, Logout} from './userThunk';

const initialState = {
  name: '',
  email: '',
  password: '',
  success: false,
  loading: false,
  users: [],
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    successFun: state => {
      return state.success;
    },
  },
  extraReducers: {
    // register new user
    [registerUser.pending]: state => {
      state.loading = true;
      console.log('pending');
    },
    [registerUser.fulfilled]: (state, {payload}) => {
      console.log('fulfilled', payload);
      state.name = payload.name;
      state.email = payload.email;
    },
    [registerUser.rejected]: state => {
      console.log('rejected');
    },
     // user logout
     [Logout.pending]: () => {
      console.log('pending - user logout');
    },
    [Logout.fulfilled]: (state, {payload}) => {
      console.log('fulfilled - user logout', payload);
      state.name = "";
      state.email = "";
    },
    [Logout.rejected]: state => {
      console.log('rejected - user logout');
    },
  },
});

// Action creators are generated for each case reducer function
export const {successFun} = UserSlice.actions;

export default UserSlice.reducer;
