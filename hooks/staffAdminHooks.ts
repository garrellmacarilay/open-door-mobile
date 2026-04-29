import api from '@/utils/api'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { OfficeHistory } from './staffHooks';
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

interface CalendarEvent {
    id: number;
    event_title: string;
    description: string;
    event_date: string;
    event_time: string;
    dateString: string; 
}

export function useEvents(month?: number, year?: number, day?: number) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setEvents([]);
        try {
            const params: Record<string, number> = {};
            if (month && year) {
                params.month = month;
                params.year = year;
                if (day) params.day = day; 
            }

            const res = await api.get('/calendar/events', { params });
            if (res.data.success) {
                const mappedEvents = res.data.data.map((evt: any) => ({
                    ...evt,
                    dateString: evt.event_date,
                }));
                setEvents(mappedEvents);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    }, [month, year, day]); // ✅ re-fetches when month/year changes

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
                await fetchEvents();
                return { success: true };
            }
            return { success: false, message: res.data.message || 'Unexpected error' };
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
    }, [fetchEvents]); // ✅ triggers when fetchEvents changes (i.e. month/year changes)

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