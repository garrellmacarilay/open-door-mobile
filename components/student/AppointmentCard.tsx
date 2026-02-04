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
            case 'pending': return 'bg-[#B45309]';
            case 'approved': return 'bg-[#15803D]';
            case 'rescheduled': return 'bg-[#961bb5]';
            default: return 'bg-red-700';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm"
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center gap-2 flex-1">
                    <Ionicons name="school-outline" size={20} color="black" />
                    <Text className="font-semibold text-gray-900 flex-1" numberOfLines={1}>
                        {appointment.title}
                    </Text>
                </View>

                <View className={`px-2 py-1 rounded-md ${getStatusStyle(appointment.details.status)}`}>
                    <Text className="text-white text-[10px] font-medium capitalize">
                        {appointment.details.status}
                    </Text>
                </View>
            </View>

            <View className="gap-1.5 ml-1">
                {/* Office */}
                <View className="flex-row items-center gap-2">
                    <Ionicons name="business-outline" size={14} color="#0059FF" />
                    <Text className="text-xs text-gray-600 font-medium">
                        {appointment.details.office}
                    </Text>
                </View>

                {/* Date */}
                <View className="flex-row items-center gap-2">
                    <Ionicons name="calendar-outline" size={14} color="#360055" />
                    <Text className="text-xs text-gray-600 font-medium">
                        {appointment.dateString}
                    </Text>
                </View>

                {/* Time */}
                <View className="flex-row items-center gap-2">
                    <Ionicons name="time-outline" size={14} color="#9D4400" />
                    <Text className="text-xs text-gray-600 font-medium">
                        {appointment.time}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
