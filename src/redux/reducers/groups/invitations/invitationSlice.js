import {createSlice} from '@reduxjs/toolkit';
import {allInvitations, addNewInviti} from './invitaionThunk';

const initialState = {
  invitations: [],
  invitationLoader: true,
};

export const invitationSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {},
  extraReducers: {
    [allInvitations.pending]: state => {
      state.invitationLoader= true
      console.log('pending invitations',state.invitationLoader);
    },
    [allInvitations.fulfilled]: (state, {payload}) => {
      state.invitationLoader = false;
      state.invitations = payload;
      console.log("fulfilled invitations", state.invitationLoader)
    },
    [allInvitations.rejected]: state => {
      state.invitationLoader = false;
      console.log('rejected invitations',state.invitationLoader);
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = invitationSlice.actions;

export default invitationSlice.reducer;
