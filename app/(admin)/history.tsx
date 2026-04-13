import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StaffHistoryModal from '@/components/staff/StaffHistoryModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAdminAppointments } from '@/hooks/adminHooks';

type FilterStatus = 'all' | 'pending' | 'approved' | 'completed' | 'declined';

export default function AdminHistory() {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const { 
        appointments, 
        loading, 
        filters, 
        updateFilter, 
        loadMore,
        onRefresh 
    } = useAdminAppointments();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', label: 'Pending' };
            case 'approved':
                return { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]', label: 'Approved' };
            case 'completed':
                return { bg: 'bg-[#DBEAFE]', text: 'text-[#4F46E5]', label: 'Completed' };
            case 'declined':
                return { bg: 'bg-[#FEE2E2]', text: 'text-[#EF4444]', label: 'Declined' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Unknown' };
        }
    };

 const FilterButton = ({ label, value }: { label: string; value: FilterStatus }) => {
        const isActive = filters.status === value;
        return (
            <TouchableOpacity
                onPress={() => updateFilter('status', value)}
                    className={`px-4 py-2 rounded-[6px] mr-2 border ${
                    isActive ? 'bg-[#18233D] border-[#18233D]' : 'bg-white border-gray-200'
                }`}
            >
                <Text                     
                    className={`text-[11px] font-semibold ${
                        isActive ? 'text-white' : 'text-gray-600'
                    }`}
                        >{label}
                    </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-100">
                <View className="flex-row items-start justify-between mb-1">
                    <View className="flex-1">
                        <Text className="text-[#1C2A48] text-2xl font-bold mb-1">Appointments</Text>
                        <Text className="text-[#1C2A48] text-xs font-bold">Consultation History</Text>
                    </View>
                
                </View>
            </View>

            {/* Filter Tabs */}
            <View className="bg-white px-5 py-3 border-b border-gray-100">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <FilterButton label="All" value="all" />
                    <FilterButton label="Pending" value="pending" />
                    <FilterButton label="Approved" value="approved" />
                    <FilterButton label="Completed" value="completed" />
                    <FilterButton label="Declined" value="declined" />
                </ScrollView>
            </View>

            {/* History List */}
            <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
                {appointments.map((item) => {
                    const statusStyle = getStatusStyle(item.details.status);
                    return (
                        <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm">
                            {/* Header with ID and Status */}
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-[10px] font-semibold mb-1">{item.details.reference_code}</Text>
                                    <Text className="text-[#1C2A48] text-[18px] font-bold leading-6">{item.title}</Text>
                                </View>
                                <View className={`px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                                    <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                                        {statusStyle.label}
                                    </Text>
                                </View>
                            </View>

                            {/* Date and Time */}
                            <View className="flex-row items-center gap-4 mb-4">
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                                    <Text className="text-gray-500 text-[10px] font-semibold">{new Date(item.start).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                                    <Text className="text-gray-500 text-[10px] font-semibold">{new Date(item.start).toLocaleTimeString('en-US', {
                                        hour12: true,
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    </Text>
                                </View>
                            </View>

                            {/* View Appointment Button */}
                            <TouchableOpacity
                                className="bg-[#18233D] rounded-xl py-3 flex-row items-center justify-center gap-2"
                                onPress={() => setSelectedAppointment(item)}
                            >
                                <Text className="text-white text-sm font-semibold">View Appointment</Text>
                                <Ionicons name="chevron-forward" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {loading && <ActivityIndicator className="my-4" />}

                {!loading && appointments.length === 0 && (
                    <View className="bg-white rounded-2xl p-12 items-center">
                        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 text-center mt-3">No records found</Text>
                    </View>
                )}

                <View style={{ height: Math.max(insets.bottom + 80, 112) }} />
            </ScrollView>

            <StaffHistoryModal
                visible={!!selectedAppointment}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onRefresh={onRefresh}
            />
        </View>
    );
}
