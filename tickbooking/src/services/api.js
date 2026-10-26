import axios from 'axios';

export const userApi = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getApiErrorMessage(error, fallback) {
  if (!error.response) {
    return 'Cannot connect to the server. Check that the backend is running.';
  }

  const data = error.response.data;

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  return fallback;
}