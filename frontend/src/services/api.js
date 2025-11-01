import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Créer une instance axios avec la base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ajouter le token aux requêtes si il existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Fonctions d'authentification
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
};

// Fonctions workouts
export const workoutsAPI = {
    getAll: async () => {
        const response = await api.get('/workouts/');
        return response.data;
    },

    getOne: async (id) => {
        const response = await api.get(`/workouts/${id}`);
        return response.data;
    },

    create: async (workoutData) => {
        const response = await api.post('/workouts/', workoutData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/workouts/${id}`);
        return response.data;
    },
};

export default api;