import api from "../utils/api";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  passwordConfirmation: string;
  setPasswordConfirmation: React.Dispatch<React.SetStateAction<string>>;
  profileImageUrl: string | null;
  setProfileAndPreview: (file: File | null) => void;
  preview: string | null;
  message: string;
  handleSubmit: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [user, setUser] = useState<Partial<User>>({});
  const [fullName, setFullName] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  // Helper to construct the Image URL (Compatible with Expo)
  const constructImageUrl = (userData: User): string | null => {
  // 1. Prioritize the full Cloudinary URL if it exists
    if (userData.profile_picture && userData.profile_picture.startsWith('http')) {
      return userData.profile_picture;
    }

    // 2. Handle the relative path from your DB: "avatars/profile_pictures/..."
    if (userData.profile_picture) {
      const apiBase = process.env.EXPO_PUBLIC_API_URL || "";
      // Ensure we have the root URL (e.g., http://192.168.1.x:8000)
      const base = apiBase.replace(/\/api\/?$/, '');
      
      // Ensure there's exactly one slash between base and path
      const path = userData.profile_picture.startsWith('/') 
        ? userData.profile_picture 
        : `/${userData.profile_picture}`;

      return `${base}${path}`;
    }

    return null;
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

  const setProfileAndPreview = (file: any) => {
    setProfilePicture(file);
    if (file && file.uri) {
      setPreview(file.uri);
    }
  };

  const handleSubmit = async () => {
    setMessage('');

    if (password && password !== passwordConfirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append('full_name', fullName);
    
    if (profilePicture) {
      // TypeScript needs the 'any' cast for FormData.append with Files in some environments
      formData.append('profile_picture', profilePicture, {
        uri: (profilePicture as any).uri,
        name: (profilePicture as any).name || 'photo.jpg',
        type: (profilePicture as any).type || 'image/jpeg',
      } as any);
    }

    if (password) {
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);
    }

    try {
      const res = await api.post('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const updatedUser: User = res.data.user;
        const url = constructImageUrl(updatedUser);

        setPreview(url);
        setProfileImageUrl(url);
        setUser(updatedUser);
        setProfilePicture(null);
        setPassword('');
        setPasswordConfirmation('');
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
    handleSubmit,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
  };
}

export function useUpcomingAppointments(office: string, status: string, month?: number, year?: number) {
  const [rawAppointments, setRawAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      // We fetch by Month/Year and Office at the API level
      const params: any = { month, year };
      if (office && office !== 'All Offices') params.office = office;
      if (status && status !== 'all') params.status = status;

      const res = await api.get('/calendar/appointments', { params });

      if (res.data.success) {
        setRawAppointments(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [office, status, month, year]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // INTERNAL FILTERING LOGIC
  const filteredAppointments = useMemo(() => {
    let list = [...rawAppointments];

    //filter by office
    if (office && office !== 'All Offices') {
      list = list.filter((apt: any) => {
        const aptOffice = apt.office?.office_name || apt.details?.office;
        return aptOffice === office;
      })
    }

    //filter by status
    if (status && status !== 'all') {
      list = list.filter((apt: any) => {
        const aptStatus = apt.details?.status?.toLowerCase() || apt.status?.toLowerCase();
        return aptStatus === status.toLowerCase();
      });
    }

    return list
  }, [rawAppointments, status, office]);

  return { 
    appointments: filteredAppointments, 
    loading, 
    refresh: fetchAppointments 
  };
}

export function useOffices() {
  const [offices, setOffices] = useState<string[]>(['All Offices']);
  

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await api.get('/offices');
        // Extract just the names from the Office objects
        const names = res.data.map((o: any) => o.office_name);
        setOffices(['All Offices', ...names]);
      } catch (err) {
        console.error("Failed to load offices", err);
      }
    };
    fetchOffices();
  }, []);

  return offices;
}

export function useHistory() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryBookings = async () => {
    try {
      setLoading(true)
      const res = await api.get('/bookings/history')
      setBookings(res.data.bookings)
    } catch (err) {
      setError('Failed to fetch booking history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoryBookings()
  }, [])

  return { bookings, fetchHistoryBookings, loading, error, setError }
}