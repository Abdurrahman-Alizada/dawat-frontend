import { createSlice } from '@reduxjs/toolkit'
import { addNewGroup, allGroups } from './groupThunk';

const initialState = {
  totalgroups : []
}


export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    // addGroup: (state, action) =>{
    //   // console.log(action.payload)
    //   const newGroup = {
    //     name : action.payload.name,
    //     avatar_url:action.payload.avatar_url,
    //     subtitle : 'subtitle',
    //     membersAvatars:[
    //       "https://bootdey.com/img/Content/avatar/avatar6.png",
    //       "https://bootdey.com/img/Content/avatar/avatar6.png",
    //       "https://bootdey.com/img/Content/avatar/avatar4.png",
    //     ]
    //   }
    //   state.push(newGroup)
    // },
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
      console.log('fulfilled', payload);
      state.totalgroups.push(payload)
    },
    [addNewGroup.rejected]: state => {
      console.log('rejected');
    },

  }
})

// Action creators are generated for each case reducer function
export const { } = groupSlice.actions

export default groupSlice.reducer