import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
const initialState = [
  {
    id: '0',
    name: 'Amy Farha',
    checked : true,
    date: new Date(),
    description: 'Some random text..',
    responsibleAvatars:[
      "https://bootdey.com/img/Content/avatar/avatar6.png",
      "https://bootdey.com/img/Content/avatar/avatar7.png",
      "https://bootdey.com/img/Content/avatar/avatar2.png",
    ]
  },
  {
    id: '1',
    name: 'Amy Farha',
    date: new Date(),
    checked : false,
    description: 'Some random text..',
    responsibleAvatars:[
      "https://bootdey.com/img/Content/avatar/avatar6.png",
      "https://bootdey.com/img/Content/avatar/avatar7.png",
      "https://bootdey.com/img/Content/avatar/avatar2.png",
    ]
  },

]

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup: (state, action) =>{
      // console.log(action.payload)
      const newGroup = {
        name : action.payload.name,
        avatar_url:action.payload.avatar_url,
        subtitle : 'subtitle',
        membersAvatars:[
          "https://bootdey.com/img/Content/avatar/avatar6.png",
          "https://bootdey.com/img/Content/avatar/avatar6.png",
          "https://bootdey.com/img/Content/avatar/avatar4.png",
        ]
      }
      state.push(newGroup)
    },
  },
})

// Action creators are generated for each case reducer function
export const { addGroup } = groupSlice.actions

export default groupSlice.reducer