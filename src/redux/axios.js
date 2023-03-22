import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://dawat-backend.onrender.com/',
  });
  
export const baseURL = 'https://dawat-backend.onrender.com'
// export const baseURL = 'https://d771-103-255-6-102.in.ngrok.io'
