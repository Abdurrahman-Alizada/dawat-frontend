import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://dawat-backend.onrender.com/',
  });
  
export const baseURL = 'https://dawat-backend.onrender.com'
// export const baseURL = 'https://a6c5-111-119-178-165.au.ngrok.io'
