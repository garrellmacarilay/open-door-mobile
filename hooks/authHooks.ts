
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';
import api from '../utils/api';
import * as SecureStore from 'expo-secure-store'

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
            console.log("2. Sending POST to:", process.env.EXPO_PUBLIC_API_URL + '/register');

            const res = await api.post('/register', data);
            return res.data as AuthResponse;
        } catch (err: any) {
            const status = err.response?.status;
            const errorData = err.response?.data;

            console.log("❌ Error Status:", status);
            console.log("❌ Error Data:", errorData);

            let displayMessage = "Registration failed";

            if (status === 422) {
                // Validation errors - pass them through
                if (errorData?.errors) {
                    displayMessage = errorData.message || 'Validation failed. Please check all fields.';
                    console.log("📋 Field Errors:", errorData.errors);
                } else if (errorData?.message) {
                    displayMessage = errorData.message
                }
                
            } else if (status === 500) {
                displayMessage = 'Server error. Please try again later.'
            } else if (errorData?.message) {
                displayMessage = errorData.message
            }
            
            setError(displayMessage);
            console.log("💬 Display Message:", displayMessage);
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
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setErrors({ general: [err.response.data.message] });
            } else {
                setErrors({ general: [err.message || 'An unexpected error occurred'] });
            }
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

export function useGoogleLogin() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const router = useRouter();
    const { login, user } = useAuth();

    useEffect(() => {
        const linkSub = Linking.addEventListener('url', ({ url }) => {
            handleDeepLink(url);
        });

        Linking.getInitialURL().then(url => {
            if (url) handleDeepLink(url);
        });

        return () => linkSub.remove();
    }, []);

    useEffect(() => {
        if (!user) return;

        if (user.role === 'admin') {
            router.replace('/(admin)/dashboard');
        } else if (user.role === 'staff') {
            router.replace('/(staff)/dashboard');
        } else {
            router.replace('/(student)/dashboard');
        }
    }, [user]);

    const handleDeepLink = async (url: string) => {
        const { queryParams } = Linking.parse(url);

        if (queryParams?.token) {
            const token = queryParams.token as string;
            await login(token);
        }

        if (queryParams?.error) {
            console.error('Auth error:', queryParams.error);
        }
    };

    const handleGoogleLogin = async () => {
        if (!apiUrl) {
            console.error('API URL not defined');
            return;
        }

        await WebBrowser.openBrowserAsync(`${apiUrl}/auth/google/mobile`);
    };

    return { handleGoogleLogin };
}

export const useForgetPassword = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const requestResetCode = async (targetEmail: string) => {
        setLoading(true);
        try {
            await api.post('/forgot-password', {
                email: targetEmail.trim()
            })
            setEmail(targetEmail.trim());
            router.push({
                    pathname: '/(auth)/confirm-code',
                    params: { email: targetEmail.trim() },
            });
        } catch (err: any) {
            const message = err.response?.data?.message || "Email not found.";
        } finally {
            setLoading(false);
        }

    }

    const verifyCode = async (codeArray: string[], currEmail: string) => {
        const fullCode = codeArray.join('')
        if (fullCode.length < 6) {
            Alert.alert("Wait", "Please enter the full 6-digit code.");
            return;
        }

        setLoading(true);

        try {
            await api.post('/verify-reset-code', {
                email: currEmail, 
                code: fullCode
            })
            router.push({
                pathname: '/(auth)/reset-password',
                params: { email: currEmail, code: fullCode },
            });
        } catch (err: any) {
            Alert.alert("Error", "Invalid or expired code.");
        } finally {
            setLoading(false);
        }
    }

    const resetPassword = async (
        currEmail: string,
        password: string,
        password_confirmation: string,
        code: string
    ) => {
        setLoading(true)

        try {
            await api.post('/reset-password', {
                email: currEmail,
                password: password,
                password_confirmation: password_confirmation, // Laravel 'confirmed' rule looks for this
                code: code
            })
            router.replace('/(auth)/password-changed');
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            const firstError = errors ? (Object.values(errors) as any)[0][0] : "Failed to reset password.";
            Alert.alert("Reset Failed", firstError);
        } finally {
            setLoading(false);
        }
    }
    return {
        loading,
        email,
        requestResetCode,
        verifyCode,
        resetPassword
    };
}


