import api from "../utils/api";
import { useState, useEffect, useCallback, useMemo } from "react";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/utils/auth";
import { Alert } from "react-native";

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
  const { user: globalUser, updateUser } = useAuth();

  const [user, setUser] = useState<Partial<User>>(globalUser || {});
  const [fullName, setFullName] = useState<string>(globalUser?.full_name || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const constructImageUrl = useCallback((userData: User): string | null => {
    if (!userData || !userData.profile_picture) return null;
    if (userData.profile_picture.startsWith('http')) return userData.profile_picture;
    
    const apiBase = process.env.EXPO_PUBLIC_API_URL || "";
    const base = apiBase.replace(/\/api\/?$/, '');
    
    const path = userData.profile_picture.startsWith('/') 
      ? userData.profile_picture 
      : `/${userData.profile_picture}`;

    return `${base}${path}`;
  }, []);

  // 🚀 SYNC EFFECT: Keeps the UI (Header & Settings) in sync with AuthContext
  useEffect(() => {
    if (globalUser) {
      setUser(globalUser);
      setFullName(globalUser.full_name || '');
      const url = constructImageUrl(globalUser as User);
      setProfileImageUrl(url);

      // Only sync the preview from the server if the user ISN'T currently 
      // picking a new unsaved image in the settings page.
      if (!profilePicture) {
        setPreview(url);
      }
    }
  }, [globalUser, constructImageUrl, !!profilePicture]);

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
      throw new Error("Passwords do not match");
    }

    const formData = new FormData();
    formData.append('_method', 'POST')
    formData.append('full_name', fullName);
    
    if (profilePicture) {
      // We cast to any here because React Native FormData requires an object 
      // with uri/name/type, which doesn't match the browser 'File' type exactly.
      formData.append('profile_picture', {
        uri: (profilePicture as any).uri,
        name: (profilePicture as any).fileName || 'photo.jpg',
        type: (profilePicture as any).mimeType || 'image/jpeg',
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

        // Update local state and global context
        setPreview(url);
        setProfileImageUrl(url);
        setUser(updatedUser);
        
        updateUser(updatedUser); 

        // Reset editing states
        setProfilePicture(null);
        setPassword('');
        setPasswordConfirmation('');
        setMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(' | ')
        : 'Profile update failed.';
      setMessage(errorMsg);
      throw err;
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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchAppointments = useCallback(async (isNextPage = false) => {
    if (loading || (isNextPage && !hasMore)) return;
    setLoading(true);

    try {
        const currentPage = isNextPage ? page + 1 : 1;

      // We fetch by Month/Year and Office at the API level
      const params: any = { 
        page: currentPage,
        office: office !== 'All Offices' ? office : undefined,
        status: status !== 'All' ? status : undefined,
        month,
        year
       };
    
      const res = await api.get('/calendar/appointments', { params });

      if (res.data.success) {
        const newData = res.data.data;

        setRawAppointments(prev => isNextPage ? [...prev, ...newData] : newData);
        setPage(res.data.meta.current_page);
        setHasMore(res.data.meta.has_more);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [office, status, month, year, page, hasMore, loading]);

  useEffect(() => {
    setRawAppointments([]);
    setPage(1);
    setHasMore(true);
    fetchAppointments(false);
  }, [office, status, month, year]);

  // INTERNAL FILTERING LOGIC
  const filteredAppointments = useMemo(() => {
    let list = [...rawAppointments];

    if (month && year) {
      list = list.filter((apt: any) => {
        const d = new Date(apt.start);
        return (d.getMonth() + 1) === month && d.getFullYear() === year;
      });
    }

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
  }, [rawAppointments, status, office, month, year]);

  return { 
    appointments: filteredAppointments, 
    loading, 
    refresh: () => fetchAppointments(false),
    hasMore,
    loadMore: () => !loading && hasMore && fetchAppointments(true)
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

export interface Notification {
  id: number;
  type: string;
  message: string;
  booking_id: number | null;
  booking_reference: string | null;
  read_at: string | null;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const res = await api.get('/notifications')

      if (res.status === 200 && res.data.success) {
        setNotifications(res.data.notifications);
      }
      
    } catch (err) {
      Alert.alert('Failed to fetch notifications')
      console.error(err)
    } finally {
      setLoading(false);
    }
  }, [user])

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const res = await api.get('/unread-count');
      if (res.status === 200 && res.data.success) {
        setUnreadCount(res.data.count);
      }
    } catch (err) {
      Alert.alert('Failed to fetch unread count')
      console.error(err)
    }
  }, [user])

  const markAsRead = async (id: number) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    
      await api.request('PATCH', `/notifications/${id}/read`)
    } catch (err) {
      Alert.alert('Failed to mark notification as read')
      console.error(err)

      fetchNotifications()
      fetchUnreadCount()
    } 
  }

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    refreshCount: fetchUnreadCount,
    markAsRead
  }
}