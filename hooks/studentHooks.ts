import api from '../utils/api';
import { useState, useEffect, useCallback } from 'react';
import React from 'react';

//to use booking
interface BookingForm {
    office_id: string;
    service_type: string;
    date: string;
    time: string;
    concern_description: string;
    uploaded_file_url: string | File;
    group_members: string;
}

export function useBookings(onSuccess?: () => void) {
    const [offices, setOffices] = useState([])
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [form, setForm] = useState({
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
            .catch(err => console.error(err));
    },[])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            const consultationDate = `${form.date}T${form.time}`;    
            formData.append('consultation_date', consultationDate);

            Object.keys(form).forEach(key => {
                const value = form[key as keyof BookingForm];
                if (key === 'date' || key === 'time') return;
                formData.append(key, value as any);
            });

            const response = await api.post('/bookings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                onSuccess?.();
                return { success: true };
            }
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                alert('Something went wrong. Please try again later.');
            }
        } 
    }

    return { form, setForm, errors, offices, handleSubmit };
}