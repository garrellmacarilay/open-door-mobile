import { useAuth } from '@/context/AuthContext';
import api from "@/utils/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from 'react-native';


export interface Appointment {
    id: number,
    title: string;
    start: string;
    end: string;
    color: string;
    details: {
        student: string;
        office: string;
        attachment: string | null;
        attachment_name: string | null;
        concern_description: string;
        group_members: string;
        status: string;
        reference_code: string;
    }
}
export function useOfficeUpcomingAppointments(month?: number, year?: number) {
    const { user } = useAuth();
    const [rawAppointments, setRawAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false);

    const fetchAppointments = useCallback(async (isNextPage = false) => {
        if (loading || (isNextPage && !hasMore) || !user) return;

        setLoading(true)
        
        try {
            const currPage = isNextPage ? page + 1 : 1;

            const params = {
                page: currPage,
                month: month,
                year: year
            }

            const res = await api.get('/office/dashboard', {params})

            if (res.data.success) {
                const newData = res.data.data

                setRawAppointments(prev => isNextPage ? [...prev, ...newData] : newData)
                setPage(res.data.meta.current_page)
                setHasMore(res.data.meta.has_more)
            }
        } catch (err) {
            console.error('Staff Appointments Fetch Error', err)
        } finally {
            setLoading(false)
        }
    }, [user, month, year, page, hasMore, loading])

    useEffect(() => {
        setRawAppointments([])
        setPage(1)
        setHasMore(true)
        fetchAppointments(false)
    }, [month, year])

    const filterAppointments = useMemo(() => {
        let list = [...rawAppointments]

        if (month && year) {
            list = list.filter((apt: any) => {
                const [datePart] = apt.start.split(' ');
                const [y, m] = datePart.split('-').map(Number);

                return m === month && y === year;
            })
        }
        return list
    }, [rawAppointments, month, year])

    return {
        appointments: filterAppointments,
        loading,
        refresh: () => fetchAppointments(false),
        hasMore,
        loadMore: () => !loading && hasMore && fetchAppointments(true)
    }
} 

export const useOfficeUpdate = (officeId: string | number | undefined) => {
    const [statusShow, setStatusShow] = useState<'active' | 'inactive' | 'loading'>('loading');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        if (!officeId) {
            setStatusShow('loading');
            return;
        }
        try {
            setError(null);
            const res = await api.get(`/office/${officeId}`);
            if (res.data.success) {
                setStatusShow(res.data.data.status);
            } else {
                const errMsg = res.data.message || 'Failed to fetch status';
                setError(errMsg);
                console.error("Failed to fetch office status:", errMsg);
            }
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : 'Network error fetching status';
            setError(errMsg);
            console.error("Failed to fetch office status", err);
        }
    }, [officeId]);

    // Fetch the status when officeId is available
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const toggleStatus = useCallback(async () => {
        if (!officeId || statusShow === 'loading' || isLoading) return;

        const previousStatus = statusShow;
        const newStatus = statusShow === 'active' ? 'inactive' : 'active';

        // Optimistic Update
        setStatusShow(newStatus);
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.put(`/office/update-status/${officeId}`, {
                status: newStatus
            });

            if (!res.data.success) {
                const errMsg = res.data.message || 'Failed to update status';
                throw new Error(errMsg);
            }

            // Re-fetch to confirm the change
            await fetchStatus();
        } catch (err) {
            setStatusShow(previousStatus); // Revert on error
            const errMsg = err instanceof Error ? err.message : 'Could not update status';
            setError(errMsg);
            Alert.alert("Error", errMsg);
            console.error("Status toggle error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [officeId, statusShow, isLoading, fetchStatus]);

    return { 
        statusShow, 
        isAvailable: statusShow === 'active', 
        toggleStatus, 
        isLoading: isLoading || statusShow === 'loading',
        error
    };
};