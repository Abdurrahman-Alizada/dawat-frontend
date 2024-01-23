import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://dawat-backend.onrender.com/',
  });
  
export const baseURL = 'https://dawat-backend.onrender.com'
// export const baseURL = 'https://bcd3-223-123-91-151.ngrok-free.app'
