import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import api from "../utils/api";

export interface BookingForm {
    office_id: string;
    service_type: string;
    date: string;
    time: string;
    concern_description: string;
    uploaded_file_url: any; // Can be a URI object from Expo
    group_members: string;
}

export function useBookings(onSuccess?: () => void) {
    const [offices, setOffices] = useState([]);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<BookingForm>({
        office_id: '',
        service_type: '',
        date: '',
        time: '',
        concern_description: '',
        uploaded_file_url: '',
        group_members: ''
    });

    useEffect(() => {
        api.get('/offices')
            .then(res => setOffices(res.data))
            .catch(err => console.error("Error fetching offices:", err));
    }, []);

    const handleSubmit = async (dataOverride?: Partial<BookingForm>) => {
        // If data is passed directly, use it, otherwise use state
        const submissionData = { ...form, ...dataOverride };
        
        setLoading(true);
        setErrors({});

        try {
            const formData = new FormData();
            
            // 1. Format date for Laravel (Y-m-d H:i:s)
            let consultationDate = ''

            try {
                const [m, d, y] = submissionData.date.split('/');
                const [timeStr, modifier] = submissionData.time.split(' ');
                let [hours, minutes] = timeStr.split(':');

                let hh = parseInt(hours, 10);
                if (modifier === 'PM' && hh < 12) hh += 12;
                if (modifier === 'AM' && hh === 12) hh = 0;

                const isoDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                const isoTime = `${hh.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;

                consultationDate = `${isoDate}T${isoTime}`;
            } catch (e){
                console.error("Date formatting failed in hook:", e);
            }

            formData.append('consultation_date', consultationDate);

            // 2. Append fields
            Object.keys(submissionData).forEach(key => {
                if (key === 'date' || key === 'time' || key === 'uploaded_file_url') return;
                
                const value = submissionData[key as keyof BookingForm];

                if (value !== undefined && value !== null) {
                    formData.append(key, value as string);
                }
            });

            // 3. SPECIAL HANDLING FOR EXPO FILES
            // Changed key to 'uploaded_file_url' to match your Laravel $request->hasFile check
            const file = submissionData.uploaded_file_url;
            
            if (file && file.uri) {
                const fileToUpload = {
                    uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
                    type: file.mimeType || 'image/jpeg',
                    name: file.name || 'upload.jpg',
                }
                formData.append('uploaded_file_url', fileToUpload as any);
            }

            const response = await api.post('/bookings', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Accept': 'application/json' }
            });

            if (response.data.success) {
                onSuccess?.();
                // Reset form on success
                setForm({
                    office_id: '',
                    service_type: '',
                    date: '',
                    time: '',
                    concern_description: '',
                    uploaded_file_url: '',
                    group_members: ''
                });
                return { success: true };
            }
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Booking submission error:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    return { form, setForm, errors, offices, handleSubmit, loading };
}

export interface BookingHistory {
    id: number;
    student_id: number;
    office_id: number;
    reference_code: string;
    group_members: string;
    student_name: string;
    office_name: string;
    service_type: string;
    attachment_name: any;
    attachment_url: any;
    concern_description: string;
    consultation_date: string;
    status: string;
    created_at: string;
    hasFeedback: boolean;
    rating: number | null;
    comment: string | null;
}

export function useHistory() {
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryBookings = async (isRefreshing = false) => {
    try {
      if (isRefreshing) setRefreshing(true);    
      else setLoading(true)

      const res = await api.get('/bookings/history')
      if (res.data.success) {
        setBookings(res.data.bookings)
      }
    } catch (err) {
      setError('Failed to fetch booking history')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHistoryBookings()
  }, [])

  return { bookings, fetchHistoryBookings, refreshing, loading, error, setError }
}

export function useCancelBooking (onSuccess: () => void) {
    const [ isCancelling, setIsCancelling] = useState(false);

    const cancelBooking = async (bookingId: number, reason?: string) => {
        setIsCancelling(true);

        try {
            const res = await api.patch(`/cancel/booking/${bookingId}`, {
                cancelled_reason: reason,
            })

            if (res.data.success) {
                Alert.alert('Success', 'Booking has been cancelled')
                if (onSuccess) onSuccess();
                return true
            }

        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to cancel booking";
            Alert.alert("Error", msg);
            return false;
        } finally {
            setIsCancelling(false)
        }
    }
    return { cancelBooking, isCancelling };
}

export const useReschedule = (onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);

    const rescheduleBooking = async (bookingId: number, dateStr: string, timeStr: string, reason?: string) => {
        setLoading(true);
        try {
            // Convert "04/17/2026" + "10:30 AM" to "2026-04-17T10:30"
            const [m, d, y] = dateStr.split('/');
            let [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
            
            const formattedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes}`;

            const res = await api.patch(`/reschedule/booking/${bookingId}`, {
                consultation_date: formattedDate,
                rescheduled_reason: reason
            });

            if (res.data.success) {
                if (onSuccess) onSuccess
                return true
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Reschedule failed";
            Alert.alert("Error", msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { rescheduleBooking, loading };
}

export interface FeedbackPayload {
    booking_id: number;
    student_id: number;
    office_id: number;
    rating: number;
    comment: string;
}

export const useSubmitFeedback = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitFeedback = async (payload: FeedbackPayload) => {
        setIsSubmitting(true);

        try {
            const res = await api.post('/feedback/store', payload)
            return { success: true, message: res.data.message };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            return { success: false, message: errorMessage };
        } finally {
            setIsSubmitting(false);
        }
    }

    return { submitFeedback, isSubmitting };
}