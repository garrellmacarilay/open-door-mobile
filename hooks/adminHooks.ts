import api from "@/utils/api";
import React, { useState, useEffect, useCallback, useMemo} from "react";
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

export interface Appointment {
  id: number;
  title: string;
  start: string;
  dateString: string;
  color: string;
  details: {
    student: string;
    office: string;
    staff: string;
    concern_description: string;
    attachment: string | null;
    attachment_name: string | null;
    service_type: string;
    status: string;
    reference_code: string;
  };
}

interface MetaData {
  current_page: number;
  last_page: number;
  total: number;
  has_more: boolean;
}
export const useAdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [meta, setMeta] = useState<MetaData | null>(null);

  // Filter States
  const [filters, setFilters] = useState({
    page: 1,
    month: '',
    year: '',
    office: 'All Offices',
    status: 'all',
  });

  const fetchAppointments = useCallback(async (isAppending = false) => {
    try {
      if (!isAppending) setLoading(true);
      
      // Build Query Params
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      if (filters.office !== 'All Offices') params.append('office', filters.office);
      if (filters.status !== 'all') params.append('status', filters.status);
      params.append('page', filters.page.toString());

      const res = await api.get(`/admin/appointments?${params.toString()}`);
      
      if (res.data.success) {
        setAppointments(prev => 
          isAppending ? [...prev, ...res.data.data] : res.data.data
        );
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  // Trigger fetch on filter change
  useEffect(() => {
    fetchAppointments();
  }, [filters.month, filters.year, filters.office, filters.status, filters.page]);

  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
  };

  const loadMore = () => {
    if (meta?.has_more && !loading) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (filters.page === 1) {
      fetchAppointments();
    } else {
      setFilters(prev => ({ ...prev, page: 1 }));
    }
  };

  return {
    appointments,
    loading,
    refreshing,
    meta,
    filters,
    updateFilter,
    loadMore,
    onRefresh
  };
};