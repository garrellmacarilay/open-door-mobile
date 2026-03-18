import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NOTIFICATIONS = [
    {
        id: 1,
        title: "John Doe booked an appointment with your office. (APPT-201)",
        note: "Note: Please review the appointment and approve or decline within 24 hours.",
        time: "5m ago",
        read: false,
    },
    {
        id: 2,
        title: "Jane Smith's appointment has been rescheduled. (APPT-202)",
        note: "Note: The student requested a new time slot. Please confirm availability.",
        time: "30m ago",
        read: false,
    },
    {
        id: 3,
        title: "Appointment with Carlos Reyes has been marked as completed. (APPT-198)",
        note: null,
        time: "Yesterday",
        read: true,
    },
    {
        id: 4,
        title: 'A student left feedback for their session on "Career Guidance."',
        note: null,
        time: "2 days ago",
        read: true,
    },
];

export default function StaffNotificationsPage() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Header */}
            <View className="px-6 pt-6 pb-4 flex-row items-center gap-3">
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="p-1 mr-1">
                    <Ionicons name="arrow-back" size={24} color="#1C274C" />
                </TouchableOpacity>
                <Text className="text-[#1C274C] text-[28px] font-extrabold tracking-tight">
                    Notifications
                </Text>
            </View>

            {/* List Container */}
            <View className="flex-1 bg-[#D1D5DB] rounded-t-[30px] pt-6 px-4">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {NOTIFICATIONS.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            activeOpacity={0.8}
                            className={`rounded-[20px] p-5 mb-4 shadow-sm border border-gray-100 ${notif.read ? 'bg-[#EEEEEE]' : 'bg-white'}`}
                        >
                            <View className="flex-row items-start justify-between">
                                <Text className="flex-1 text-[#1C274C] text-[13px] font-bold leading-5 mr-4">
                                    {notif.title}
                                </Text>
                                <View className={`w-2.5 h-2.5 rounded-full mt-1.5 ${notif.read ? 'bg-[#9CA3AF]' : 'bg-[#0F766E]'}`} />
                            </View>

                            {notif.note && (
                                <View className="mt-3 bg-[#F0FDF4] rounded-[10px] p-3">
                                    <Text className="text-[#374151] text-[11px] leading-4 font-medium">
                                        {notif.note}
                                    </Text>
                                </View>
                            )}

                            <Text className="mt-3 text-[11px] font-semibold text-[#9CA3AF]">
                                {notif.time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
