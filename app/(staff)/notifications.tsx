import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/hooks/globalHooks';

export default function StaffNotificationsPage() {
    const router = useRouter();
    const { notifications, loading, refresh, markAsRead } = useNotifications();

    // Calculate unread count from the real data
    const unreadCount = notifications.filter(n => !n.read_at).length;

    const renderItem = ({ item }: { item: any }) => {
        const isRead = !!item.read_at;

        return (
            <TouchableOpacity
                onPress={() => !isRead && markAsRead(item.id)}
                activeOpacity={0.8}
                className={`rounded-[16px] p-4 mb-3 border ${
                    isRead ? 'bg-white border-gray-100' : 'bg-[#EFF6FF] border-[#BFDBFE]'
                }`}
            >
                <View className="flex-row items-start justify-between">
                    <Text 
                        className={`flex-1 text-[13px] font-bold leading-5 mr-3 ${
                            isRead ? 'text-[#374151]' : 'text-[#1C274C]'
                        }`}
                    >
                        {item.message}
                    </Text>
                    {!isRead && (
                        <View className="w-2.5 h-2.5 rounded-full mt-1 bg-[#3B82F6]" />
                    )}
                </View>

                {/* Sub-content / Booking Reference */}
                {item.booking_reference && (
                    <View className="mt-2 bg-gray-50 rounded-[8px] p-2 border border-gray-100">
                        <Text className="text-[#6B7280] text-[11px] font-medium">
                            Ref: {item.booking_reference}
                        </Text>
                    </View>
                )}

                <Text className="mt-3 text-[11px] font-semibold text-[#9CA3AF]">
                    {item.created_at}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Header with Back Button */}
            <View className="px-6 pt-6 pb-2 flex-row items-center gap-3">
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

            {/* Unread Subheader */}
            <View className="px-6 pb-4 ml-10">
                <Text className="text-[#6B7280] text-[13px] font-medium">
                    {unreadCount} unread
                </Text>
            </View>

            {/* List Container - Changed to White as per preferred UI */}
            <View className="flex-1 bg-white rounded-t-[30px] pt-6 px-4">
                {loading && notifications.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator color="#1C274C" />
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        refreshControl={
                            <RefreshControl 
                                refreshing={loading} 
                                onRefresh={refresh} 
                                tintColor="#1C274C"
                            />
                        }
                        ListEmptyComponent={
                            <View className="mt-20 items-center justify-center">
                                <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 font-medium mt-2">No notifications yet.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}