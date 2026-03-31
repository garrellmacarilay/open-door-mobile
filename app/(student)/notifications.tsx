import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NOTIFICATIONS = [
    {
        id: 1,
        title: 'New Appointment Request',
        body: 'Vincent Lee Duriga requested an appointment with the Student Internship Office (Mar 31, 2026 at 10:00 AM).',
        time: '2 minutes ago',
        read: false,
    },
    {
        id: 2,
        title: 'Appointment Cancellation',
        body: 'Garrell Macarilay canceled his office appointment with the Student Publication for March 30, 2026, 12:00 PM.',
        time: '1 hour ago',
        read: false,
    },
    {
        id: 3,
        title: 'New Review Received',
        body: 'Margarette Calumpiano left a 5-star review for the Guidance and Counseling Office.',
        time: '3 hours ago',
        read: false,
    },
    {
        id: 4,
        title: 'New Appointment Request',
        body: 'Evangeline Anggana requested an appointment with the Student Internship Office (Mar 28, 2026 at 10:00 AM).',
        time: '5 hours ago',
        read: false,
    },
    {
        id: 5,
        title: 'New Appointment Request',
        body: 'Eunice Lugtu requested an appointment with the Student Internship Office (Mar 28, 2026 at 09:00 AM).',
        time: '5 hours ago',
        read: true,
    },
    {
        id: 6,
        title: 'New Appointment Request',
        body: 'Lowe David Tubat requested an appointment with the Student Publication Office (Mar 28, 2026 at 03:00 PM).',
        time: '5 hours ago',
        read: true,
    },
];

export default function NotificationsPage() {
    const insets = useSafeAreaInsets();
    const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Header */}
            <View className="px-6 pt-6 pb-4">
                <Text className="text-[#1C274C] text-[28px] font-extrabold tracking-tight">
                    Notifications
                </Text>
                <Text className="text-[#6B7280] text-[13px] font-medium mt-0.5">
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
                                    style={{ fontFamily: 'Poppins-Bold' }}
                                >
                                    {notif.title}
                                </Text>
                                {!notif.read && (
                                    <View className="w-2.5 h-2.5 rounded-full mt-1 bg-[#3B82F6]" />
                                )}
                            </View>

                            <Text className={`mt-1.5 text-[12px] leading-[18px] ${notif.read ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                                {notif.body}
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
