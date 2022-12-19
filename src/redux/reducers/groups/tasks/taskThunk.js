import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';

export const TasksApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dawat-backend.onrender.com',
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tasks'],
  reducerPath: 'TasksApi',
  endpoints: build => ({
    getAllTasks: build.query({
      query: ({groupId}) => `/api/group/tasks/${groupId}`,
      providesTags: ['Tasks'],
    }),
    addTask: build.mutation({
      query: task => ({
        url: `/api/group/tasks`,
        method: 'POST',
        body: {
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          groupId: task.groupId,
        },
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateTask: build.mutation({
      query: task => ({
        url: `/api/group/tasks/update`,
        method: 'PUT',
        body: {
          taskId: task.taskId,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
        },
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: build.mutation({
      query: task => ({
        url: `/api/group/tasks/delete`,
        method: 'DELETE',
        body: {
          taskId: task.taskId,
          groupId: task.groupId,
        },
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = TasksApi;
