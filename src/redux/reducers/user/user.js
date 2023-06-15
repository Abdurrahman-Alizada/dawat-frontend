import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  password: '',
  success: false,
  loading: false,
  currentLoginUser : {},
  users: [],
  passwordResetSuccessflly : false
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleCurrentLoaginUser: (state, action) => {
      state.currentLoginUser = action.payload
    },
    handlePasswordResetSuccessfully: (state, action) => {
      state.passwordResetSuccessflly = action.payload
    },
    
  },

});

// Action creators are generated for each case reducer function
export const {handleCurrentLoaginUser,handlePasswordResetSuccessfully} = UserSlice.actions;

export default UserSlice.reducer;
