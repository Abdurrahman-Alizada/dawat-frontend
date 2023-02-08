import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  invitations: [],
  invitationRefetch : false,
  isExportBanner : false,
  currentInviti: {}
};

export const invitationSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    handleIsExportBanner: (state, action) => {
      state.isExportBanner = action.payload;
    },
    handleCurrentInviti: (state, action) => {
      state.currentInviti = action.payload;
    },
  },
  
});

// Action creators are generated for each case reducer function
export const {handleIsExportBanner, handleCurrentInviti} = invitationSlice.actions;

export default invitationSlice.reducer;
