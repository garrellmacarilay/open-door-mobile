
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface VerifyData {
    email: string;
    verification_code: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    user?: any;
    token?: string;
    expires_at?: string;
}

// --- Hook ---

export function useAuthRegistration() {
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth()

    // 1. Register Logic
    const register = async (data: RegisterData): Promise<AuthResponse> => {

        console.log("☎️ 1. Register Function Triggered with data:", data);

        setLoading(true);
        setError(null);
        try {
            console.log("📡 2. Sending POST to:", process.env.EXPO_PUBLIC_API_URL + '/register');

            const res = await api.post('/register', data);

            if (res.status >= 400) {
                console.error("❌ 3. Backend rejected request:", res.data);
                const msg = res.data?.message || res.data?.error || "Registration failed";
                setError(msg);
                throw new Error(msg);
            }
            return res.data as AuthResponse;
        } catch (err: any) {
            console.error("❌ 4. Registration Error Details:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
            const msg = err.response?.data?.message || "Registration failed";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 2. Verify Email Logic
    const verifyEmail = async (verifyData: VerifyData): Promise<AuthResponse> => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/verify-email', verifyData);
            const data = res.data

            if (data.success && data.token) {
                await login(data.token)
            }

            return data as AuthResponse;
        } catch (err: any) {
            const msg = err.response?.data?.message || "Verification failed";
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async (email: string) => {
        setResendLoading(true)

        try {
            const res = await api.post('/auth/resend-otp', { email })

            return {
                success: true,
                message: res.data.message || 'Code resent successfully'
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to resend code';
            return {
                success: false,
                message: errorMessage
            }
        } finally {
            setResendLoading(false);
        }
    }

    return { 
        register, 
        verifyEmail, 
        loading, 
        error, 
        setError,
        resendOtp,
        resendLoading,
         
    };
}

interface LoginResponse {
    success: boolean;
    access_token?: string;
    message?: string;
    user?: any;
    errors?: {
        email?: string[];
        password?: string[];
        general?: string[];
    }
}
export const useLogin = () => {
    const [errors, setErrors] = useState<LoginResponse['errors']>({});
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        setErrors({});
        try {
            const res = await api.post('/login', {email, password});
            const responseData = res.data as LoginResponse;

            if (res.status >= 400 || !responseData.success) {
                setErrors(responseData.errors || { general: [responseData.message || 'Login Failed'] });
                return false;
            }

            const { access_token } = responseData;
            if (access_token) {
                await login(access_token);
                router.replace('/'); // Redirect to home or dashboard
                return true;
            }

            setErrors({ general: ['Login Failed'] });
            return false;
        } catch (err: any) {
            console.error("Login error:", err);
            setErrors({ general: [err.message || 'An unexpected error occurred'] });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, errors, setErrors };
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


//TODO: update google client
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


