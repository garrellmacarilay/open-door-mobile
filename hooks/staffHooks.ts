import api from "@/utils/api";
import React, { useState, useEffect, useCallback, useMemo} from "react";
import { useAuth } from '@/context/AuthContext';
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