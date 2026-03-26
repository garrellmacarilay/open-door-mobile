import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, FlatList } from 'react-native';
import { useNotifications } from '@/hooks/globalHooks';

export default function NotificationsPage() {
    const { notifications, loading, refresh, markAsRead} = useNotifications()

    
    const renderItem = ({item}: {item: any}) => {
        const isRead = !!item.read_at; //if null

        return (
            <TouchableOpacity
                onPress={() => !isRead && markAsRead(item.id)}
                activeOpacity={0.7}
                className={`rounded-[20px] p-5 mb-4 shadow-sm border border-gray-100 ${isRead ? 'bg-[#EEEEEE]' : 'bg-white'}`}
            >
                <View className="flex-row items-start justify-between">
                    <Text className="flex-1 text-[#1C274C] text-[13px] font-bold leading-5 mr-4">
                        {item.message}
                    </Text>
                    {/* Visual indicator for unread */}
                    <View className={`w-2.5 h-2.5 rounded-full mt-1.5 ${isRead ? 'bg-[#9CA3AF]' : 'bg-[#3B82F6]'}`} />
                </View>

                {/* Assuming 'note' maps to something from your backend or you can add a fallback */}
                {item.booking_reference && (
                    <View className="mt-3 bg-[#F3F4F6] rounded-[10px] p-3">
                        <Text className="text-[#4B5563] text-[11px] leading-4 font-medium">
                            Ref: {item.booking_reference}
                        </Text>
                    </View>
                )}

                <Text className="mt-3 text-[11px] font-semibold text-[#9CA3AF]">
                    {item.created_at} {/* This is the "5m ago" string from Carbon */}
                </Text>
            </TouchableOpacity>
        );
    }
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
                            <RefreshControl refreshing={loading} onRefresh={refresh} />
                        }
                        ListEmptyComponent={
                            <View className="mt-20 items-center justify-center">
                                <Text className="text-gray-500 font-medium">No notifications yet.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </View>
    );
}
