import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EventCardProps {
    event: {
        id: number | string;
        event_title: string;
        description: string;
        event_date: string
        event_time: string
    }
    onPress?: () => void 
}

export default function EventCard({ event, onPress }: EventCardProps ) {
    const getDate = () => {
        try {
            const date = new Date(event.event_date);
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            return { day, month };
        } catch {
            return { day: '20', month: 'FEB' };
        }
    }

    const { day, month } = getDate();
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
                    {event.event_title}
                </Text>
                <Text className="text-[12px] font-semibold text-[#9CA3AF]" numberOfLines={1}>
                    {/* Reusing ID or fall back to service_type based on reference data */}
                    {typeof event.id === 'string' && event.id.includes('-')
                        ? event.id
                        : event.description}
                </Text>
            </View>

            {/* Status Pill */}
            <View className={`px-3 py-1.5 rounded-full border bg-[#89CFF0] border-[0077B6]`}>
                <Text className={`text-[11px] font-bold capitalize text-[#03045E]`}>
                    Event
                </Text>
            </View>
        </TouchableOpacity>
    );

} 