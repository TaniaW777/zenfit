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
// Fonctions nutrition
export const nutritionAPI = {
    getAll: async (date) => {
        const params = date ? `?date=${date}` : '';
        const response = await api.get(`/nutrition/${params}`);
        return response.data;
    },

    getOne: async (id) => {
        const response = await api.get(`/nutrition/${id}`);
        return response.data;
    },

    create: async (mealData) => {
        const response = await api.post('/nutrition/', mealData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/nutrition/${id}`);
        return response.data;
    },

    getDailySummary: async (date) => {
        const params = date ? `?date=${date}` : '';
        const response = await api.get(`/nutrition/daily-summary${params}`);
        return response.data;
    },
};
export default api;