import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NOTIFICATIONS = [
    {
        id: 1,
        title: 'John Doe booked an appointment with your office. (APPT-201)',
        note: 'Note: Please review the appointment and approve or decline within 24 hours.',
        time: '5m ago',
        read: false,
    },
    {
        id: 2,
        title: "Jane Smith's appointment has been rescheduled. (APPT-202)",
        note: 'Note: The student requested a new time slot. Please confirm availability.',
        time: '30m ago',
        read: false,
    },
    {
        id: 3,
        title: 'Appointment with Carlos Reyes has been marked as completed. (APPT-198)',
        note: null,
        time: 'Yesterday',
        read: true,
    },
    {
        id: 4,
        title: 'A student left feedback for their session on "Career Guidance."',
        note: null,
        time: '2 days ago',
        read: true,
    },
];

export default function AdminNotificationsPage() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Header */}
            <View className="px-6 pt-6 pb-4">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="p-1 mr-1"
                    >
                        <Ionicons name="arrow-back" size={24} color="#1C274C" />
                    </TouchableOpacity>
                    <Text className="text-[#1C274C] text-[28px] font-extrabold tracking-tight">
                        Notifications
                    </Text>
                </View>
                <Text className="text-[#6B7280] text-[13px] font-medium mt-0.5 ml-9">
                    {unreadCount} unread
                </Text>
            </View>

            {/* List Container */}
            <View className="flex-1 bg-white rounded-t-[30px] pt-6 px-4">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 56, 96) }}
                >
                    {NOTIFICATIONS.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            activeOpacity={0.8}
                            className={`rounded-[16px] p-4 mb-3 border ${notif.read ? 'bg-white border-gray-100' : 'bg-[#EFF6FF] border-[#BFDBFE]'}`}
                        >
                            <View className="flex-row items-start justify-between">
                                <Text
                                    className={`flex-1 text-[13px] font-bold leading-5 mr-3 ${notif.read ? 'text-[#374151]' : 'text-[#1C274C]'}`}
                                >
                                    {notif.title}
                                </Text>
                                {!notif.read && (
                                    <View className="w-2.5 h-2.5 rounded-full mt-1 bg-[#3B82F6]" />
                                )}
                            </View>

                            <Text className={`mt-1.5 text-[12px] leading-[18px] ${notif.read ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                                {notif.note ?? ''}
                            </Text>

                            <Text className="mt-2.5 text-[11px] font-semibold text-[#9CA3AF]">
                                {notif.time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
