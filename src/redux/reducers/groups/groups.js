import { createSlice } from '@reduxjs/toolkit'
import { addNewGroup, allGroups, allInvitations } from './groupThunk';

const initialState = {
  totalgroups : [],
  invitations : [],
  tasks : [],
  chat :[]
}


export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {

  },
  extraReducers :{
    //get all groups
    [allGroups.pending]: state =>{
      console.log("pending")
    },
    [allGroups.fulfilled]: (state, {payload}) => {
      state.totalgroups = payload;
    },
    [allGroups.rejected]: state => {
      console.log('rejected');
    },

    // add group
    [addNewGroup.pending]: state => {
      console.log('pending');
    },
    [addNewGroup.fulfilled]: (state, {payload}) => {
      // console.log('fulfilled', payload);
      state.totalgroups.push(payload)
    },
    [addNewGroup.rejected]: state => {
      console.log('rejected');
    },


    //get all invitations
    [allInvitations.pending]: state =>{
      console.log("pending")
    },
    [allInvitations.fulfilled]: (state, {payload}) => {
      console.log("invitaions ",  payload)
      // state.invitations = payload;
    },
    [allInvitations.rejected]: state => {
      console.log('rejected');
    },

  }
})

// Action creators are generated for each case reducer function
export const { } = groupSlice.actions

export default groupSlice.reducer