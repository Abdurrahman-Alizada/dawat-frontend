import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  password: '',
  success: false,
  loading: false,
  currentLoginUser : {},
  users: [],
  passwordResetSuccessflly : false,
  currentLanguage: 'en',
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
    handleCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
  },

});

// Action creators are generated for each case reducer function
export const {handleCurrentLoaginUser,handlePasswordResetSuccessfully, handleCurrentLanguage} = UserSlice.actions;

export default UserSlice.reducer;
