import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// ── Translation ─────────────────────────────────────────────────────────────
export const translateText = async (data) => {
  return api.post('/translate', data);
};

export const detectLanguage = async (data) => {
  return api.post('/detect-language', data);
};

export const checkGrammar = async (data) => {
  return api.post('/grammar', data);
};

export const detectEmotion = async (data) => {
  return api.post('/emotion', data);
};

// ── Voice / Speech ──────────────────────────────────────────────────────────
export const speechToText = async (formData) => {
  return api.post('/speech-to-text', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const textToSpeech = async (data) => {
  return api.post('/text-to-speech', data, {
    responseType: 'blob',
  });
};

// ── OCR ─────────────────────────────────────────────────────────────────────
export const extractOcr = async (formData) => {
  return api.post('/ocr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── PDF ─────────────────────────────────────────────────────────────────────
export const extractPdf = async (formData) => {
  return api.post('/pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── History & Favorites ─────────────────────────────────────────────────────
export const getHistory = async (params = {}) => {
  return api.get('/history', { params });
};

export const deleteHistory = async (id) => {
  return api.delete(`/history/${id}`);
};

export const toggleFavorite = async (data) => {
  // data: { history_id: number, is_favorite: boolean }
  return api.post('/favorite', data);
};

export default api;
