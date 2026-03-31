import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

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
    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Header */}
            <View className="px-6 pt-6 pb-4 flex-row items-center gap-3">
                <Text className="text-[#1C274C] text-[28px] font-extrabold tracking-tight">
                    Notifications
                </Text>
            </View>

            {/* List Container */}
            <View className="flex-1 bg-[#D1D5DB] rounded-t-[30px] pt-6 px-4">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {NOTIFICATIONS.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            activeOpacity={0.8}
                            className={`rounded-[20px] p-5 mb-4 shadow-sm border border-gray-100 ${
                                notif.read ? 'bg-[#EEEEEE]' : 'bg-white'
                            }`}
                        >
                            <View className="flex-row items-start justify-between">
                                <Text className="flex-1 text-[#1C274C] text-[13px] font-bold leading-5 mr-4" style={{ fontFamily: 'Poppins-Bold' }}>
                                    {notif.title}
                                </Text>
                                <View
                                    className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                                        notif.read ? 'bg-[#9CA3AF]' : 'bg-[#7C3AED]'
                                    }`}
                                />
                            </View>

                            {notif.body && (
                                <View className="mt-3 bg-[#F0FDF4] rounded-[10px] p-3">
                                    <Text className="text-[#374151] text-[11px] leading-4 font-medium">
                                        {notif.body}
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
