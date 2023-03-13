import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://dawat-backend.onrender.com/',
  });
  
export const baseURL = 'https://dawat-backend.onrender.com'
// export const baseURL = 'https://a668-111-119-178-130.ap.ngrok.io'
