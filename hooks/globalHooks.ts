import api from "../utils/api";
import { useState, useEffect } from "react";
import React from "react";

// 1. Define the User Shape
interface User {
  id?: number;
  full_name: string;
  profile_picture?: string;
  profile_picture_url?: string;
}

// 2. Define the Hook Return Type
interface UseProfileReturn {
  user: Partial<User>;
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  setProfilePicture: React.Dispatch<React.SetStateAction<File | null>>;
  profileImageUrl: string | null;
  setProfileAndPreview: (file: File | null) => void;
  preview: string | null;
  message: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [user, setUser] = useState<Partial<User>>({});
  const [fullName, setFullName] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  // Helper to construct the Image URL (Compatible with Expo)
  const constructImageUrl = (userData: User): string | null => {
    const apiBase = process.env.EXPO_PUBLIC_API_URL || "";
    // Strips /api from the end to get the root storage path
    const base = apiBase.replace(/\/api\/?$/, '');

    return userData.profile_picture_url || 
           (userData.profile_picture ? `${base}/storage/${userData.profile_picture}` : null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/show/user');
        const fetchedUser: User = res.data.user;
        
        setUser(fetchedUser);
        setFullName(fetchedUser.full_name);

        const url = constructImageUrl(fetchedUser);
        setPreview(url);
        setProfileImageUrl(url);
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };
    fetchUser();
  }, []);

  const setProfileAndPreview = (file: File | null) => {
    setProfilePicture(file);
    if (file) {
      // NOTE: FileReader works on Web. If using Expo ImagePicker on Mobile,
      // you usually get a URI directly, so you wouldn't need FileReader.
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('full_name', fullName);
    
    if (profilePicture) {
      // TypeScript needs the 'any' cast for FormData.append with Files in some environments
      formData.append('profile_picture', profilePicture as any);
    }

    try {
      const res = await api.post('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const updatedUser: User = res.data.user;
        const url = constructImageUrl(updatedUser);

        setPreview(url);
        setProfileImageUrl(url);
        setUser(updatedUser);
        setProfilePicture(null);
        setMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        setMessage(Object.values(errors).flat().join(' | '));
      } else {
        setMessage('Profile update failed. Please try again.');
      }
    }
  };

  return {
    user,
    fullName,
    setFullName,
    setProfilePicture,
    profileImageUrl,
    setProfileAndPreview,
    preview,
    message,
    handleSubmit
  };
}