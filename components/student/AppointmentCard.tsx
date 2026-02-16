import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppointmentCardProps {
    appointment: {
        id: number | string;
        title: string;
        details: {
            student?: string;
            office: string;
            status: 'pending' | 'approved' | 'rescheduled' | 'cancelled';
            service_type: string;
        };
        dateString: string;
        time: string;
    };
    onPress?: () => void;
}

export default function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
            case 'approved': return { bg: 'bg-green-100', text: 'text-green-700' };
            case 'rescheduled': return { bg: 'bg-purple-100', text: 'text-purple-700' };
            default: return { bg: 'bg-red-100', text: 'text-red-700' };
        }
    };

    // Extract date parts from dateString (e.g., "21 - 0007/IMTC")
    const getDateParts = () => {
        // For now, using a simple format. Adjust based on actual data
        const date = new Date(appointment.dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    const { day, month } = getDateParts();
    const statusStyle = getStatusStyle(appointment.details.status);

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm flex-row items-center gap-3"
        >
            {/* Date Badge */}
            <View className="bg-[#E8EEFF] rounded-xl w-14 h-14 items-center justify-center">
                <Text className="text-[#4F46E5] text-xl font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                    {day}
                </Text>
                <Text className="text-[#4F46E5] text-[10px] font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                    {month}
                </Text>
            </View>

            {/* Appointment Details */}
            <View className="flex-1">
                <Text className="font-bold text-gray-900 text-sm mb-1" numberOfLines={1} style={{ fontFamily: 'Poppins-SemiBold' }}>
                    {appointment.title}
                </Text>
                <Text className="text-xs text-gray-600 mb-0.5" numberOfLines={1}>
                    {appointment.details.service_type}
                </Text>
                <Text className="text-xs text-gray-500" numberOfLines={1}>
                    {appointment.time}
                </Text>
            </View>

            {/* Status Badge */}
            <View className={`px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                <Text className={`text-[10px] font-semibold capitalize ${statusStyle.text}`} style={{ fontFamily: 'Poppins-SemiBold' }}>
                    {appointment.details.status}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
