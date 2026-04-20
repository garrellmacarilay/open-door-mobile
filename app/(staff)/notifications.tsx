import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, Notification } from '@/hooks/globalHooks';
import { useOfficeHistory, History } from '@/hooks/staffHooks';
import { useAppointmentDetail } from '@/hooks/staffAdminHooks';
import StaffHistoryModal from '@/components/staff/StaffHistoryModal';

export default function StaffNotificationsPage() {
    const router = useRouter();
    const { notifications, loading: loadingNotifs, refresh, markAsRead } = useNotifications();
    
    const { appointments, onRefresh: refreshHistory } = useOfficeHistory('all');
    
    const { getDetail, loading: isFetchingDetail } = useAppointmentDetail();
    
    const [selectedAppointment, setSelectedAppointment] = useState<History | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const unreadCount = notifications.filter(n => !n.read_at).length;

    const handlePressNotification = async (notification: Notification) => {
        // Mark as read immediately
        if (!notification.read_at) {
            markAsRead(notification.id);
        }

        if (!notification.booking_id) return;

        const localMatch = appointments.find(appt => 
            appt.id === notification.booking_id || 
            appt.details.reference_code === notification.booking_reference
        );

        if (localMatch) {
            setSelectedAppointment(localMatch);
            setModalVisible(true);
        } else {
            const fetchedAppointment = await getDetail(notification.booking_id);
            if (fetchedAppointment) {
                setSelectedAppointment(fetchedAppointment);
                setModalVisible(true);
            }
        }
    };

    const renderItem = ({ item }: { item: Notification }) => {
        const isRead = !!item.read_at;

        return (
            <TouchableOpacity
                onPress={() => handlePressNotification(item)}
                activeOpacity={0.8}
                className={`rounded-[16px] p-4 mb-3 border ${
                    isRead ? 'bg-white border-gray-100' : 'bg-[#EFF6FF] border-[#BFDBFE]'
                }`}
            >
                <View className="flex-row items-start justify-between">
                    <Text className={`flex-1 text-[13px] font-bold leading-5 mr-3 ${isRead ? 'text-[#374151]' : 'text-[#1C274C]'}`}>
                        {item.message}
                    </Text>
                    {!isRead && <View className="w-2.5 h-2.5 rounded-full mt-1 bg-[#3B82F6]" />}
                </View>

                {item.booking_reference && (
                    <View className="mt-2 bg-gray-50 rounded-[8px] p-2 border border-gray-100">
                        <Text className="text-[#6B7280] text-[11px] font-medium">Ref: {item.booking_reference}</Text>
                    </View>
                )}

                <Text className="mt-3 text-[11px] font-semibold text-[#9CA3AF]">{item.created_at}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            {/* Header */}
            <View className="px-6 pt-6 pb-2 flex-row items-center gap-3">
                <TouchableOpacity onPress={() => router.back()} className="p-1 mr-1">
                    <Ionicons name="arrow-back" size={24} color="#1C274C" />
                </TouchableOpacity>
                <Text className="text-[#1C274C] text-[28px] font-extrabold tracking-tight">Notifications</Text>
            </View>

            <View className="px-6 pb-4 ml-10">
                <Text className="text-[#6B7280] text-[13px] font-medium">{unreadCount} unread</Text>
            </View>

            {/* List */}
            <View className="flex-1 bg-white rounded-t-[30px] pt-6 px-4">
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={loadingNotifs} onRefresh={refresh} tintColor="#1C274C" />
                    }
                    ListEmptyComponent={
                        <View className="mt-20 items-center justify-center">
                            <Ionicons name="notifications-off-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-400 font-medium mt-2">No notifications yet.</Text>
                        </View>
                    }
                />
            </View>

            {/* Global Fetching Overlay */}
            {isFetchingDetail && (
                <View className="absolute inset-0 bg-black/10 flex items-center justify-center z-50">
                    <View className="bg-white p-6 rounded-2xl shadow-lg items-center">
                        <ActivityIndicator size="large" color="#1C274C" />
                        <Text className="text-[#1C274C] font-bold mt-3">Loading Details...</Text>
                    </View>
                </View>
            )}

            {/* Appointment Modal */}
            <StaffHistoryModal
                visible={modalVisible}
                appointment={selectedAppointment}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedAppointment(null);
                }}
                onRefresh={() => {
                    refresh();        
                    refreshHistory(); 
                }}
            />
        </View>
    );
}