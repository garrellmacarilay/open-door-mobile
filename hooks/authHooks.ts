
import { useRouter } from 'expo-router';
import { useState } from 'react';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (email, password) => {
        setLoading(true);
        setMessage('');
        try {
            console.log('Logging in with:', email, password);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Navigate to admin or home on success
            // router.replace('/(tabs)'); 
            alert('Login Successful!');
        } catch (error) {
            setMessage('Login failed');
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return { handleLogin, loading, message };
};

export const useGoogleLogin = () => {
    const handleGoogleLogin = () => {
        console.log('Google login clicked');
        alert('Google login functionality would be implemented here');
    };

    return { handleGoogleLogin };
};
