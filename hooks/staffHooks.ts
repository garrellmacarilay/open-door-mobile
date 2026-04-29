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
export function useOfficeUpcomingAppointments(month?: number, year?: number, day?: number, status?: string) {
    const { user } = useAuth();
    const [rawAppointments, setRawAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false);

    const fetchAppointments = useCallback(async (isNextPage = false) => {
        if (loading || (isNextPage && !hasMore) || !user) return;

        const now = new Date();
        const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
        const isPastMonth = year !== undefined && month !== undefined &&
            (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1));

        if (isPastMonth) {
            setRawAppointments([]);
            setHasMore(false);
            return;
        }


        setLoading(true)
        
        try {
            const currPage = isNextPage ? page + 1 : 1;

            const params = {
                page: currPage,
                month: month,
                year: year,
                day,
                status: status !== 'all' ? status : undefined,
                min_day: isCurrentMonth && !day ? now.getDate() : undefined,
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
    }, [user, month, year, status, day, page, hasMore, loading])

    useEffect(() => {
        setRawAppointments([])
        setPage(1)
        setHasMore(true)
        fetchAppointments(false)
    }, [month, year, day, status])

    const filterAppointments = useMemo(() => {
        const now = new Date();
        const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
        const isPastMonth = year !== undefined && month !== undefined &&
            (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1));

        if (isPastMonth) return [];

        const excludedStatuses = ['rescheduled', 'cancelled', 'completed'];
        
        let list = rawAppointments.filter((apt: any) => {
            const aptStatus = (apt.details?.status || apt.status)?.toLowerCase();
            return !excludedStatuses.includes(aptStatus);
        });

        // 2. Filter by Date
        if (month && year) {
            list = list.filter((apt: any) => {
                const dateStr = apt.start || apt.dateString;
                if (!dateStr) return false;
                const parts = dateStr.split('-');
                const y = Number(parts[0]);
                const m = Number(parts[1]);
                return m === month && y === year;
            });
        }

        if (isCurrentMonth && !day) {
            const today = now.getDate();
            list = list.filter((apt: any) => {
                const dateStr = apt.start || apt.dateString;
                if (!dateStr) return false;
                const d = Number(dateStr.split('-')[2]?.split(' ')[0]?.split('T')[0]);
                return d >= today;
            });
        }

        if (day) {
            list = list.filter((apt: any) => {
                const dateStr = apt.start || apt.dateString;
                if (!dateStr) return false;
                const d = Number(dateStr.split('-')[2]?.split(' ')[0]?.split('T')[0]);
                return d === day;
            });
        }

        // 3. Filter by specific status (if not 'all')
        if (status && status !== 'all') {
            list = list.filter((apt: any) => {
                const aptStatus = (apt.details?.status || apt.status)?.toLowerCase();
                return aptStatus === status.toLowerCase();
            });
        }
        
        return list;
    }, [rawAppointments, month, year, day, status]);

    return {
        appointments: filterAppointments,
        loading,
        refresh: () => fetchAppointments(false),
        hasMore,
        loadMore: () => !loading && hasMore && fetchAppointments(true)
    }
} 

export interface OfficeHistory {
  id: number;
  title: string;
  start: string;
  dateString: string;
  end: string;
  color: string;
  details: {
    student: string;
    office: string;
    staff: string;
    attachment_url: string | null;
    attachment_name: string | null;
    group_members: any;
    concern_description: string;
    cancelled_reason: string;
    rescheduled_reason: string;
    declined_reason: string
    status: string;
    reference_code: string;
    feedback: {
      ratings: number ;
      comment: string;
    };
  };
}

export function useOfficeHistory(status: string = 'all') {
  const [appointments, setAppointments] = useState<OfficeHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); 

  const fetchHistory = useCallback(async (pageToFetch: number, isNextPage: boolean) => {
    if (loading) return;

    setLoading(true);
    setAppointments([])
    try {
      const response = await api.get('/office/history-mobile', {
        params: {
          page: pageToFetch,
          status: status,
        },
      });

      if (response.data.success) {
        const newData = response.data.data;
        
        // Use functional updates for arrays to ensure we always have the latest 'prev'
        setAppointments((prev) => (isNextPage ? [...prev, ...newData] : newData));
        setPage(response.data.meta.current_page);
        setHasMore(response.data.meta.has_more);
      }
    } catch (error) {
      console.error('Error fetching office history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status]); // Only re-define if status changes

  // 1. Initial Load & Reset when Status changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    // Directly pass '1' to avoid waiting for the 'page' state to update
    fetchHistory(1, false);
  }, [status, fetchHistory]);

  // 2. Pull-to-refresh logic
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory(1, false);
  }, [fetchHistory]);

  // 3. Infinite scroll logic
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchHistory(page + 1, true);
    }
  }, [hasMore, loading, page, fetchHistory]);

  return {
    appointments,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    loadMore,
  };
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