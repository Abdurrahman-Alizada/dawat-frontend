import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';

export const TasksApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dawat-backend.herokuapp.com',
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
          groupId: "635771e21d6218220f3c3f24",
        },
      }),
      invalidatesTags: ['Tasks'],
    }),
    updateInviti: build.mutation({
      query: inviti => ({
        url: `/api/group/Tasks/update`,
        method: 'PUT',
        body: {
          invitiId: inviti.invitiId,
          invitiName: inviti.invitiName,
          invitiDescription: inviti.invitiDescription,
        },
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteInviti: build.mutation({
      query: inviti => ({
        url: `/api/group/Tasks/delete`,
        method: 'DELETE',
        body: {
          invitiId: inviti.invitiId,
          groupId: inviti.groupId,
        },
      }),
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useUpdateInvitiMutation,
  useDeleteInvitiMutation
} = TasksApi;
