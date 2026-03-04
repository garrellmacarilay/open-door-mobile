import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const NOTIFICATIONS = [
    {
        id: 1,
        title: "The Student Internship's Office approved your appointment booking. (APPT-123)",
        note: "Note: The time slot you requested is no longer available. Please select a different time",
        time: "5m ago",
        read: false,
    },
    {
        id: 2,
        title: "The Student Publication's Office declined your appointment booking. (APPT-124)",
        note: "Note: The time slot you requested is no longer available. Please select a different time",
        time: "20m ago",
        read: false,
    },
    {
        id: 3,
        title: "Your appointment with the Student Organization's Office is marked as completed. Leave feedback.",
        note: null,
        time: "Yesterday",
        read: true,
    },
    {
        id: 4,
        title: 'The Student Organization\'s Office added an event "Orientation Session."',
        note: null,
        time: "2 days ago",
        read: true,
    }
];

export default function NotificationsPage() {
    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Header */}
            <View className="px-6 pt-6 pb-4">
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
                                <Text className="flex-1 text-[#1C274C] text-[13px] font-bold leading-5 mr-4" style={{ fontFamily: 'Poppins-Bold' }}>
                                    {notif.title}
                                </Text>
                                <View className={`w-2.5 h-2.5 rounded-full mt-1.5 ${notif.read ? 'bg-[#9CA3AF]' : 'bg-[#3B82F6]'}`} />
                            </View>

                            {notif.note && (
                                <View className="mt-3 bg-[#F3F4F6] rounded-[10px] p-3">
                                    <Text className="text-[#4B5563] text-[11px] leading-4 font-medium">
                                        {notif.note}
                                    </Text>
                                </View>
                            )}

                            <Text className={`mt-3 text-[11px] font-semibold ${notif.read ? 'text-[#9CA3AF]' : 'text-[#9CA3AF]'}`}>
                                {notif.time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
