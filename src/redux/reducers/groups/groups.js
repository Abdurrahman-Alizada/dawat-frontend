import {createSlice} from '@reduxjs/toolkit';
import {addNewGroup, allGroups, allInvitations} from './groupThunk';

const initialState = {
  totalgroups: [],
  groupLoader: true,
  invitations: [],
  invitationsLoader: false,
  tasks: [],
  chat: [],
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: {
    //get all groups
    [allGroups.pending]: state => {
      console.log('pending');
      state.groupLoader = true;
    },
    [allGroups.fulfilled]: (state, {payload}) => {
      state.groupLoader = false
      state.totalgroups = payload;
    },
    [allGroups.rejected]: state => {
      state.groupLoader = false
      console.log('rejected');
    },

    // add group
    [addNewGroup.pending]: state => {
      console.log('pending');
    },
    [addNewGroup.fulfilled]: (state, {payload}) => {
      // console.log('fulfilled', payload);
      state.totalgroups.push(payload);
    },
    [addNewGroup.rejected]: state => {
      console.log('rejected');
    },

    //get all invitations
    [allInvitations.pending]: state => {
      state.invitationsLoader = true;
      console.log('pending');
    },
    [allInvitations.fulfilled]: (state, {payload}) => {
      console.log('invitaions ', payload);
      state.invitationsLoader = false;
      state.invitations = payload;
    },
    [allInvitations.rejected]: state => {
      state.invitationsLoader = false;
      console.log('rejected');
    },
  },
});

// Action creators are generated for each case reducer function
export const {} = groupSlice.actions;

export default groupSlice.reducer;
