import api from '@/utils/api'
import { useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'



export default function useUpdateStatus() {
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