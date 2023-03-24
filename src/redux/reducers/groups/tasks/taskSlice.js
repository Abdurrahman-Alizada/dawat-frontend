import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  currentViewingTask: {},
  isTasksSearch: false,
  tasksSearchQuery: '',
  tasksCopyForSearch: [],
};

export const invitationSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    handleCurrentViewingTask: (state, action) => {
      state.currentViewingTask = action.payload;
    },
    handleTasks: (state, action) => {
      state.tasks = action.payload;
      state.tasksCopyForSearch = action.payload;
    },
    handleIsTaskSearch: (state, action) => {
      state.isTasksSearch = action.payload;
    },
    handleTasksSearch: (state, action) => {
      state.tasksSearchQuery = action.payload;

      if (action.payload) {
        const newData = state.tasksCopyForSearch?.filter(item => {
          const itemData = item.taskName
            ? item.taskName.toUpperCase()
            : ''.toUpperCase();
          const textData = action.payload?.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        state.tasks = newData;
      } else {
        state.tasks = [];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  handleCurrentViewingTask,
  handleTasks,
  handleIsTaskSearch,
  handleTasksSearch,
} = invitationSlice.actions;

export default invitationSlice.reducer;
