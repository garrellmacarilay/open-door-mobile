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

export interface Office {
  id: string;
  office_name: string;
  contact_email: string;
  status: 'Available' | 'Unavailable'
}

export const useAdminOffices = () => {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const[error, setError] = useState(null)

  const fetchOffices = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/offices')

      const transformed = (res.data.offices || []).map((o: any) => ({
        id: String(o.id),
        office_name: o.office_name,
        contact_email: o.contact_email,
        status: o.status === 'active' ? 'Available' : 'Unavailable'
      }))

      setOffices(transformed);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch offices");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffices()
  }, [])

  return { offices, loading, error, refetch: fetchOffices}
}

export const useCreateOffice = (onSuccess?: () => void) => {
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null);

  const createOffice = async (officeName: string, email: string) => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const res = await api.post('/admin/office/create', {
        office_name: officeName,
        contact_email: email,
        status: 'active'
      })

      if (res.data.success) {
        if (onSuccess) onSuccess();
        return { success: true }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create office";
      setCreateError(msg);

      return { success: false, error: msg };

    } finally {
      setIsCreating(false);
    }
  }

  return { createOffice, isCreating, createError };
}

export const useUpdateOffice = (onSuccess?: () => void) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOffice = async (id: string, data: {
      office_name?: string;
      contact_email?: string;
      status?: 'Available' | 'Unavailable';
  }) => {
      setIsUpdating(true);

      try {
          const payload: any = {};
          if (data.office_name) payload.office_name = data.office_name;
          if (data.contact_email) payload.contact_email = data.contact_email;
          if (data.status) {
              payload.status = data.status === 'Available' ? 'active' : 'inactive';
          }

          const response = await api.patch(`/admin/office/update/${id}`, payload);

          if (response.data.success) {
              if (onSuccess) onSuccess();
              return { success: true };
          }
      } catch (err: any) {
          return { 
              success: false, 
              error: err.response?.data?.message || "Update failed" 
          };
      } finally {
          setIsUpdating(false);
      }
  };

  return { updateOffice, isUpdating };
};

export const useDeleteOffice = (onSuccess: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteOffice = async (id: string) => {
    setIsDeleting(true);

    try {
      const res = await api.delete(`/admin/office/delete/${id}`);

      if (res.data.success) {
        if (onSuccess) onSuccess()
          return { success: true }
      }

    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete office"
      }
    } finally {
      setIsDeleting(false);
    }
  }
  return { deleteOffice, isDeleting }; 
}