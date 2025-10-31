import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    // Sauvegarder le token dans localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await authAPI.register(userData);
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Erreur lors de l\'inscription' };
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await authAPI.login(credentials);
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Erreur lors de la connexion' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);