import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HistoryModal from '../../components/staff/StaffHistoryModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOfficeUpcomingAppointments } from '@/hooks/staffHooks';

type FilterStatus = 'all' | 'pending' | 'approved' | 'completed' | 'declined';

export default function StaffHistory() {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    // 1. Hook Integration
    const { appointments, loading, refresh } = useOfficeUpcomingAppointments();

    const getStatusStyle = (status: string) => {
        // Ensure lowercase comparison to match backend strings
        const s = status?.toLowerCase();
        switch (s) {
            case 'pending':   return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
            case 'approved':  return { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Approved' };
            case 'completed': return { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Completed' };
            case 'declined':  return { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Declined' };
            default:          return { bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'Unknown' };
        }
    };

    // 2. Filter logic for the UI tabs
    const filteredData = useMemo(() => {
        if (activeFilter === 'all') return appointments;
        return appointments.filter(item => item.details.status.toLowerCase() === activeFilter);
    }, [appointments, activeFilter]);

    const FilterButton = ({ label, value }: { label: string; value: FilterStatus }) => {
        const isActive = activeFilter === value;
        return (
            <TouchableOpacity
                onPress={() => setActiveFilter(value)}
                className={`px-4 py-2 rounded-lg mr-2 ${isActive ? 'bg-[#0F766E]' : 'bg-white border border-gray-200'}`}
            >
                <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">

            {/* Header - Identical UI */}
            <View className="bg-white px-5 pt-4 pb-4 border-b border-gray-100">
                <View className="flex-row items-start justify-between mb-1">
                    <View className="flex-1">
                        <Text className="text-[#1C2A48] text-2xl font-bold mb-1">
                            Records
                        </Text>
                        <Text className="text-gray-500 text-xs">
                            Consultation History
                        </Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 items-center justify-center bg-[#0F766E] rounded-lg">
                        <Ionicons name="calendar-outline" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Tabs - Identical UI */}
            <View className="bg-white px-5 py-3 border-b border-gray-100">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <FilterButton label="All" value="all" />
                    <FilterButton label="Pending" value="pending" />
                    <FilterButton label="Approved" value="approved" />
                    <FilterButton label="Completed" value="completed" />
                    <FilterButton label="Declined" value="declined" />
                </ScrollView>
            </View>

            {/* History List - Kept as ScrollView with exact mapping UI */}
            <ScrollView 
                className="flex-1 px-5 pt-4" 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} color="#0F766E" />
                }
            >
                {filteredData.map((item, index) => {
                    const statusStyle = getStatusStyle(item.details.status);
                    return (
                        <View key={index} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                            {/* Header with ID and Status */}
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    {/* reference_code used for the ID text */}
                                    <Text className="text-gray-500 text-xs mb-1">{item.details.reference_code}</Text>
                                    <Text className="text-[#1C2A48] text-base font-bold">{item.details.student}</Text>
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
                                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-xs">{new Date(item.start).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-xs">{new Date(item.start).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
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

                {/* Empty State */}
                {!loading && filteredData.length === 0 && (
                    <View className="bg-white rounded-2xl p-12 items-center">
                        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 text-center mt-3">No records found</Text>
                    </View>
                )}

                <View style={{ height: Math.max(insets.bottom + 80, 112) }} />
            </ScrollView>

            <HistoryModal
                visible={!!selectedAppointment}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onRefresh={refresh}
            />
        </View>
    );
}