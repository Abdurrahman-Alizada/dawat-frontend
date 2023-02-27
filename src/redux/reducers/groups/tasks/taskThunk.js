import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';
import { baseURL } from '../../../axios';
export const TasksApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Tasks','TaskLogs'],
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
          statuses:[],
          responsibles:task.responsibles,
          startingDate: task.startDate,
          dueDate: task.dueDate,
          priority: task.prority    
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
    // update fields
    updateTitle: build.mutation({
      query: task => ({
        url: `/api/group/tasks/${task.taskId}/updateName`,
        method: 'PATCH',
        body: {
          previousTaskName: task.previousTaskName,
          newTaskName: task.newTaskName,
          userId:task.userId
        },
      }),
      invalidatesTags: ['Tasks','TaskLogs'],
    }),

    updateDescription: build.mutation({
      query: task => ({
        url: `/api/group/tasks/${task.taskId}/updateDescription`,
        method: 'PATCH',
        body: {
          taskDescription: task.taskDescription,
          userId:task.userId
        },
      }),
      invalidatesTags: ['Tasks','TaskLogs'],
    }),

    updateStartingDates: build.mutation({
      query: task => ({
        url: `/api/group/tasks/${task.taskId}/updateStartingDates`,
        method: 'PATCH',
        body: {
          previousStartingDate: task.previousStartingDate,
          startingDate: task.startingDate,
          userId:task.userId
        },
      }),
      invalidatesTags: ['Tasks','TaskLogs'],
    }),

    updateDueDates: build.mutation({
      query: task => ({
        url: `/api/group/tasks/${task.taskId}/updateDueDates`,
        method: 'PATCH',
        body: {
          previousDueDate: task.previousDueDate,
          dueDate: task.dueDate,
          userId:task.userId
        },
      }),
      invalidatesTags: ['Tasks','TaskLogs'],
    }),

    updatePriority: build.mutation({
      query: task => ({
        url: `/api/group/tasks/${task.taskId}/updatePriority`,
        method: 'PATCH',
        body: {
          previousPriority: task.previousPriority,
          priority: task.priority,
          userId:task.userId
        },
      }),
      invalidatesTags: ['Tasks','TaskLogs'],
    }),

    updateResponsibles: build.mutation({
      query: task => ({
        url: `/api/group/tasks/${task.taskId}/updateResponsibles`,
        method: 'PATCH',
        body: {
          responsibles: task.responsibles,
          userId:task.userId
        },
      }),
      invalidatesTags: ['Tasks','TaskLogs'],
    }),
    
    markAsCompleted: build.mutation({
      query: task => ({
        url: `/api/group/tasks/${task.taskId}/markAsCompleted`,
        method: 'PATCH',
        body: {
          condition: task.condition,
          userId:task.userId
        },
      }),
      invalidatesTags: ['Tasks','TaskLogs'],
    }),

    allLogsForTask: build.query({
      query: ({taskId}) => `/api/group/task/logs/${taskId}`,
      providesTags: ['TaskLogs'],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTitleMutation,
  useUpdateDescriptionMutation,
  useUpdateStartingDatesMutation,
  useUpdateDueDatesMutation,
  useUpdatePriorityMutation,
  useUpdateResponsiblesMutation,
  useAllLogsForTaskQuery,
  useMarkAsCompletedMutation
} = TasksApi;
