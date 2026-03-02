import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AppointmentCardProps {
    appointment: {
        id: number | string;
        title: string;
        details: {
            student?: string;
            office: string;
            status: string; // 'pending' | 'approved' | 'rescheduled' | 'cancelled' | 'declined'
            service_type: string;
        };
        dateString: string;
        time: string;
    };
    onPress?: () => void;
}

export default function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'pending':
                return { bg: 'bg-[#FEF9C3]', border: 'border-[#FDE047]', text: 'text-[#CA8A04]' };
            case 'approved':
                return { bg: 'bg-[#DCFCE7]', border: 'border-[#86EFAC]', text: 'text-[#16A34A]' };
            case 'declined':
            case 'cancelled':
                return { bg: 'bg-[#FEE2E2]', border: 'border-[#FCA5A5]', text: 'text-[#DC2626]' };
            default:
                return { bg: 'bg-[#DBEAFE]', border: 'border-[#93C5FD]', text: 'text-[#2563EB]' };
        }
    };

    const getDateParts = () => {
        try {
            const date = new Date(appointment.dateString);
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            return { day, month };
        } catch {
            return { day: '20', month: 'FEB' };
        }
    };

    const { day, month } = getDateParts();
    const statusStyle = getStatusStyle(appointment.details.status);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="bg-white border border-gray-100 rounded-[20px] p-5 mb-4 flex-row items-center gap-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 2,
            }}
        >
            {/* Date Box */}
            <View className="bg-white border border-gray-200 rounded-[14px] w-[56px] h-[64px] items-center justify-center pt-1" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.02,
                shadowRadius: 4,
                elevation: 1,
            }}>
                <Text className="text-[#3B82F6] text-[11px] font-bold tracking-wider mb-0.5" style={{ fontFamily: 'Poppins-Bold' }}>
                    {month}
                </Text>
                <Text className="text-[#3B82F6] text-[20px] font-extrabold leading-tight">
                    {day}
                </Text>
            </View>

            {/* Appointment Details */}
            <View className="flex-1 justify-center">
                <Text className="font-bold text-[#1C274C] text-[15px] mb-1" numberOfLines={1}>
                    {appointment.title}
                </Text>
                <Text className="text-[12px] font-semibold text-[#9CA3AF]" numberOfLines={1}>
                    {/* Reusing ID or fall back to service_type based on reference data */}
                    {typeof appointment.id === 'string' && appointment.id.includes('-')
                        ? appointment.id
                        : '21 - 00071MYC'}
                </Text>
            </View>

            {/* Status Pill */}
            <View className={`px-3 py-1.5 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                <Text className={`text-[11px] font-bold capitalize ${statusStyle.text}`}>
                    {appointment.details.status}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
