import api, { getBaseUrl } from "@/utils/api";
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from "react";
import { Linking } from 'react-native';

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

export const useAdminHistory = (status: string = 'all') => {
  const [appointments, setAppointments] = useState<History[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchHistory = useCallback(async (pageToFetch: number, isNextPage: boolean) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await api.get('/admin/history-mobile', {
        params: {
          page: pageToFetch,
          status: status,
        },
      });

      if (response.data.success) {
        const newData = response.data.data;
        
        setAppointments((prev) => (isNextPage ? [...prev, ...newData] : newData));
        setPage(response.data.meta.current_page);
        setHasMore(response.data.meta.has_more);
      }
    } catch (err: any) {
      if (err.name!== 'AbortError') {
        console.error('Error fetching office history:', err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [status]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchHistory(1, false);

  }, [status, fetchHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchHistory(1, false);
  }, [fetchHistory]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchHistory(page + 1, true);
    }
  }, [hasMore, loading, page, fetchHistory]);

  return {
    appointments,
    loading,
    refreshing,
    onRefresh,
    loadMore,
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

export const useGenerateReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const generateReport = useCallback(async (): Promise<void> => {
    setIsGenerating(true);
    setError('');

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) { 
        setError('Authentication required. Please log in.'); 
        return; 
      }

      const apiUrl = getBaseUrl();

      // 1. Kick off the job
      const startRes = await fetch(
        `${apiUrl}/admin/analytics/generate-report?token=${encodeURIComponent(token)}`,
        { 
          method: 'GET',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
          } 
        }
      );

      if (!startRes.ok) {
        const errorText = await startRes.text();
        throw new Error(`Server returned ${startRes.status}: ${errorText}`);
      }

      const data = await startRes.json();
      const { job_id } = data;
      if (!job_id) throw new Error('Failed to start report generation.');

      // 2. Poll every 4 seconds, up to 2 minutes
      const maxAttempts = 30;
      const tempUri = `${FileSystem.cacheDirectory}consultation_report_check.pdf`;

      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 4000));

        const downloadResult = await FileSystem.downloadAsync(
          `${apiUrl}/admin/analytics/report-status/${job_id}?token=${encodeURIComponent(token)}`,
          tempUri,
          {
            headers: { 'Accept': 'application/json' }
          }
        );

        // Check Content-Type (Check both uppercase and lowercase keys)
        const contentType = downloadResult.headers['content-type'] || downloadResult.headers['Content-Type'];

        if (contentType?.includes('application/pdf')) {
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: 'application/pdf',
              dialogTitle: 'Download Consultation Report',
              UTI: 'com.adobe.pdf', // Better for iOS sharing
            });
          }
          return; // Success! Exit the function
        }

        // If not a PDF, it's a JSON status update
        const body = await FileSystem.readAsStringAsync(downloadResult.uri).catch(() => '{}');
        
        // Handle HTML Error pages
        if (body.trim().startsWith('<')) {
          console.error('Server returned HTML:', body.substring(0, 200));
          throw new Error('Server error: received HTML instead of status.');
        }

        const { status } = JSON.parse(body);
        if (status === 'failed') throw new Error('Report generation failed on server.');
        
        // If status is 'pending' or 'processing', the loop continues...
        console.log(`Polling report status: ${status}...`);
      }

      throw new Error('Report generation timed out.');

    } catch (err: any) {
      setError(err.message || 'Failed to generate report.');
      console.error('Report generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateReport, isGenerating, error };
};

export const useConsultationStats = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/analytics/stats');
          
            if (response.data?.success) {
                setStats(response.data.stats);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch statistics');
            console.error('Stats Error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
};
interface ServiceDistribution {
  id: number;
  label: string;
  count: number;
  color: string;
}

export const useServiceDistribution = () => {
  const [distribution, setDistribution] = useState<ServiceDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('')

  const COLORS = ['#6366F1', '#06B6D4', '#10B981', '#A855F7', '#F59E0B', '#EC4899', '#8B5CF6'];

  const fetchDistribution = async () => {
    try {
      const res = await api.get('/admin/analytics/distribution')

      if (res.data.success) {
        const formatted: ServiceDistribution[] = res.data.distribution.map((item: any, index: number) => ({
          id: index,
          label: item.office,
          count: Number(item.count),
          color: COLORS[index % COLORS.length]
        }));
        setDistribution(formatted)
      }
    } catch(err: any) {
      setError('Server Error, try again later')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDistribution(); }, []);

  return { distribution, loading, error };
}

export interface Feedback {
  id: number;
  office: string,
  rating: number,
  reviews: number,
  feedback: []
}

export const useOfficesFeedback = () => {
  const [officeFeedback, setOfficeFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('')

  const fetchFeedback = async () => {
    setLoading(true)

    try {
      const res = await api.get('/admin/analytics/office-feedback')

      if (res.data.success) {
        const formattedData = res.data.feedback.map((item: any) => ({
          ...item,
          rating: Number(item.rating),
          reviews: Number(item.reviews)
        }))
        setOfficeFeedback(formattedData)
      }
    } catch (err: any) {
      setError('Server error, please try again later')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFeedback(); }, []);

  return { officeFeedback, loading, error, refresh: fetchFeedback };
}