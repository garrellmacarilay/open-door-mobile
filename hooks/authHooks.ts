
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface LoginResponse {
    success: boolean;
    access_token?: string;
    message?: string;
    user?: any;
}
export const useLogin = () => {
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        setMessage('Logging in...');
        try {
            const res = await api.post('/login', {email, password});
            const { success, access_token, message: apiMessage } = res.data as LoginResponse;
           
            if (success && access_token) {
                await login(access_token);
                setMessage('Login successful!');
                router.replace('/'); // Redirect to home or dashboard
            } else {
                setMessage(apiMessage || 'Login failed');
            }
        } catch (err: any) {
            console.error("Login error:", err);
            const errorMsg = err.response?.data?.message || "Something went wrong.";
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, message, setMessage };
};

export const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { logout: contextLogout } = useAuth();
    const router = useRouter();

    const handleLogout = async (): Promise<void> => {
        // Prevent multiple simultaneous clicks
        if (loading) return;

        setLoading(true);
        
        try {
            // 1. Attempt server-side logout with a short timeout
            // We use a try/catch specifically for the API so it doesn't 
            // block the local logout if the network is dead.
            try {
                await api.post('/logout', {}, { timeout: 5000 });
            } catch (apiErr) {
                console.warn("Server logout timed out or failed:", apiErr);
            }

            // 2. Clear local storage/state (Crucial step)
            await contextLogout();

            // 3. Navigate BEFORE setting loading to false
            // This prevents trying to update state on an unmounted screen.
            router.replace('/(auth)/login');
            
        } catch (err) {
            console.error("Critical logout error:", err);
            // Emergency fallback
            await contextLogout();
            router.replace('/(auth)/login');
        } finally {
            // Note: We don't strictly need setLoading(false) here 
            // because the screen is unmounting, but it's okay to keep 
            // if you aren't seeing warnings.
        }
    };

    return { handleLogout, loading };
};

interface GoogleLoginHook {
    handleGoogleLogin: () => Promise<void>;
}
export function useGoogleLogin(): GoogleLoginHook {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const handleGoogleLogin = async (): Promise<void> => {
        if (!apiUrl) {
            console.error('API URL is not defined');
            return;
        }

        const authUrl = `${apiUrl}/auth/google`;

        await WebBrowser.openBrowserAsync(authUrl);
    };

    return { handleGoogleLogin };
};
