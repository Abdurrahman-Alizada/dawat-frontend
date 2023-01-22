import {createSlice} from '@reduxjs/toolkit';

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

});

// Action creators are generated for each case reducer function
export const {successFun} = UserSlice.actions;

export default UserSlice.reducer;
