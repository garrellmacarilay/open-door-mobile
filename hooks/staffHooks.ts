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
export function useOfficeUpcomingAppointments(month?: number, year?: number, status?: string) {
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
                year: year,
                status: status !== 'all' ? status : undefined,
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
    }, [user, month, year, status, page, hasMore, loading])

    useEffect(() => {
        setRawAppointments([])
        setPage(1)
        setHasMore(true)
        fetchAppointments(false)
    }, [month, year, status])

    const filterAppointments = useMemo(() => {
        // 1. Define what we NEVER want to show
        const excludedStatuses = ['rescheduled', 'cancelled', 'completed'];
        
        let list = rawAppointments.filter((apt: any) => {
            const aptStatus = (apt.details?.status || apt.status)?.toLowerCase();
            return !excludedStatuses.includes(aptStatus);
        });

        // 2. Filter by Date
        if (month && year) {
            list = list.filter((apt: any) => {
                const [datePart] = apt.start.split(' ');
                const [y, m] = datePart.split('-').map(Number);
                return m === month && y === year;
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
    }, [rawAppointments, month, year, status]);

    return {
        appointments: filterAppointments,
        loading,
        refresh: () => fetchAppointments(false),
        hasMore,
        loadMore: () => !loading && hasMore && fetchAppointments(true)
    }
} 

export interface History {
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
    attachment: string | null;
    attachment_name: string | null;
    group_members: any;
    concern_description: string;
    status: string;
    reference_code: string;
    feedback: {
      ratings: number | string;
      comment: string;
    };
  };
}

export function useOfficeHistory(status: string = 'all') {
  const [appointments, setAppointments] = useState<History[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const fetchHistory = useCallback(async (isNextPage = false) => {
    if (loading || (isNextPage && !hasMore)) return;

    setLoading(true);
    try {
      const currentPage = isNextPage ? page + 1 : 1;
      
      const response = await api.get('/office/history-mobile', {
        params: {
          page: currentPage,
          status: status,
        },
      });

      if (response.data.success) {
        const newData = response.data.data;
        
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
  }, [page, hasMore, loading, status]);

  // Initial load or reset when status changes
  useEffect(() => {
    setAppointments([]);
    setPage(1);
    setHasMore(true);
    fetchHistory(false);
  }, [status]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(false);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchHistory(true);
    }
  };

  return {
    appointments,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    loadMore,
  };
}
export function useAppointmentDetail() {
    const [data, setData] = useState<History | null>(null);
    const [loading, setLoading] = useState(false);

    const getDetail = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const response = await api.get(`/office/history-mobile/${id}`);
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