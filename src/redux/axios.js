import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://dawat-backend.onrender.com/',
  });
  
export const baseURL = 'https://dawat-backend.onrender.com'
//  export const baseURL = 'https://6b7c-223-123-92-254.ngrok-free.app'
