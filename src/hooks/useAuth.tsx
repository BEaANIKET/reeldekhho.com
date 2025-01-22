import { useState } from 'react';
import api from '../services/api/axiosConfig';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../store/slices/authSlice';

interface User {
    id: string;
    name: string;
    email: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

interface RegisterResponse {
    message: string;
}

interface UseAuthReturn {
    loading: boolean;
    error: string | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loginErr: String | null;
}

const useAuth = (): UseAuthReturn => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loginErr, setLoginErr] = useState<string | null>(null);
    const dispatch = useDispatch();

    const isLoggedIn = !!token;

    const login = async (email: string, password: string): Promise<User | null> => {
        setLoading(true);
        setLoginErr(null);
        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.clear()
            localStorage.setItem('token', token);
            setToken(token);
            dispatch(setUserProfile(user));
            return user;
        } catch (err: any) {
            console.error('Login failed:', err.response?.data?.error || err.message);
            setLoginErr(err.response?.data?.message || 'Login failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return false;
        }
        try {
            await api.post<RegisterResponse>('/auth/register', { name, email, password });
            return true;
        } catch (err: any) {
            console.error('Registration failed:', err.response?.data?.error || err.message);
            setError(err.response?.data?.message || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setToken(null);
        dispatch(setUserProfile(null));
    };

    return {
        loading,
        error,
        isLoggedIn,
        login,
        register,
        logout,
        loginErr
    };
};

export default useAuth;
