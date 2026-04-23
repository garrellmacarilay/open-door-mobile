import api from '@/utils/api'
import { useState, useCallback, useEffect } from 'react'
import { History } from './staffHooks';
import { useAuth } from '@/context/AuthContext'

export function useUpdateStatus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateStatus = useCallback(async (id: number, payload: { status: string; declined_reason?: string }) => {
        setLoading(true)
        setError(null)
        setSuccess(false)

    try {
      const res = await api.patch(`/bookings/status/${id}`,  payload );

      if (res.data.success) {
        setSuccess(true);
        return true
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      return false
    } finally {
      setLoading(false);
    }
    }, [])

    return { loading, error, success, updateStatus };
}

export function useAppointmentDetail() {
    const [data, setData] = useState<History | null>(null);
    const [loading, setLoading] = useState(false);

    const getDetail = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const response = await api.get(`/consultation/history-mobile/${id}`);
            if (response.data.success) {
                setData(response.data.data);
                return response.data.data; // Return data so the caller can use it immediately
            }
        } catch (error) {
            console.error("Error fetching appointment detail:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetDetail = () => setData(null);

    return {
        appointment: data,
        loading,
        getDetail,
        resetDetail
    };
}

export function useEvents() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch Events
    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/calendar/events');
            if (res.data.success) {
                // Map the data to match your CalendarWidget 'dateString' requirement
                const mappedEvents = res.data.data.map((evt: any) => ({
                    ...evt,
                    dateString: evt.event_date, // CalendarWidget looks for this
                }));
                setEvents(mappedEvents);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. Create Event
    const createEvent = async (payload: { 
        event_title: string; 
        description: string; 
        event_date: string; 
        event_time: string; 
    }) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await api.post('/create/event', payload);
            if (res.data.success) {
                await fetchEvents(); // Refresh list after creating
                return { success: true };
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to create event";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { 
        events, 
        loading, 
        isSubmitting, 
        setError,
        error, 
        createEvent, 
        refreshEvents: fetchEvents 
    };
}