import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getUserFromToken, User } from '../utils/auth'; 
import api from '../utils/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const updateUser = (userData: User) => {
    setUser(userData);
  }

  // Load token and user on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("1. App Started: Checking SecureStore...");
        const token = await SecureStore.getItemAsync('userToken');
        
        if (token) {
          console.log("2. Token found! Token length:", token.length);
          const userData = await getUserFromToken();
          
          if (userData) {
            console.log("3. User data fetched successfully:", userData.full_name);
            console.log('User role is: ', userData?.role)
            setUser(userData);
          } else {
            console.log("3. User data returned null (Token might be expired)");
          }
        } else {
          console.log("2. No token found in storage.");
        }
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);
  const login = async (token: string) => {
    // Save token securely on the device
    await SecureStore.setItemAsync('userToken', token);
    
    // Update API headers if needed
    // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const userData = await getUserFromToken();
    setUser(userData);
  };

  const logout = async () => {
    // Remove from device storage
    await SecureStore.deleteItemAsync('userToken');
    
    // Clear API headers
    // delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};