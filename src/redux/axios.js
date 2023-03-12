import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://dawat-backend.onrender.com/',
  });
  
export const baseURL = 'https://dawat-backend.onrender.com'
// export const baseURL = 'https://bfa7-111-119-178-142.ap.ngrok.io'
