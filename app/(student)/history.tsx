import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HistoryModal from '../../components/student/HistoryModal';
import { useHistory, BookingHistory } from '@/hooks/studentHooks'; // Ensure BookingHistory is exported from your hook file

type FilterStatus = 'all' | 'pending' | 'approved' | 'completed' | 'declined';

export default function History() {
    // 1. Hook Integration
    const { bookings, loading, refreshing, fetchHistoryBookings } = useHistory();
    
    // 2. State
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<BookingHistory | null>(null);

    // 3. Status Styling Logic (Backend status is typically lowercase)
    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
            case 'approved': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' };
            case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' };
            case 'declined': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        }
    };

    // 4. Memoized Filtering Logic
    const filteredData = useMemo(() => {
        if (activeFilter === 'all') return bookings;
        return bookings.filter(item => item.status.toLowerCase() === activeFilter);
    }, [bookings, activeFilter]);

    const FilterButton = ({ label, value }: { label: string; value: FilterStatus }) => {
        const isActive = activeFilter === value;
        return (
            <TouchableOpacity
                onPress={() => setActiveFilter(value)}
                className={`px-4 py-2 rounded-lg ${isActive ? 'bg-[#1C2A48]' : 'bg-white border border-gray-200'}`}
            >
                <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`} style={{ fontFamily: 'Inter-SemiBold' }}>
                    {label}
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
                        <Text className="text-[#1C2A48] text-2xl font-bold mb-1" style={{ fontFamily: 'Poppins-Bold' }}>
                            Records
                        </Text>
                        <Text className="text-gray-500 text-xs" style={{ fontFamily: 'Inter-Regular' }}>
                            Consultation History
                        </Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => fetchHistoryBookings()}
                        className="w-10 h-10 items-center justify-center bg-[#1C2A48] rounded-lg"
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Ionicons name="refresh" size={20} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Tabs */}
            <View className="bg-white px-5 py-3 border-b border-gray-100">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                    <FilterButton label="All" value="all" />
                    <FilterButton label="Pending" value="pending" />
                    <FilterButton label="Approved" value="approved" />
                    <FilterButton label="Completed" value="completed" />
                    <FilterButton label="Declined" value="declined" />
                </ScrollView>
            </View>

            {/* History List */}
            <ScrollView 
                className="flex-1 px-5 pt-4" 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchHistoryBookings(true)} />
                }
            >
                {filteredData.map((item) => {
                    const statusStyle = getStatusStyle(item.status);
                    return (
                        <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                            {/* Header with ID and Status */}
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Inter-Regular' }}>
                                        {item.reference_code}
                                    </Text>
                                    <Text className="text-[#1C2A48] text-base font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                                        {item.office_name}
                                    </Text>
                                    <Text className="text-gray-400 text-[11px]" style={{ fontFamily: 'Inter-Regular' }}>
                                        {item.service_type}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                                    <Text className={`text-xs font-semibold ${statusStyle.text}`} style={{ fontFamily: 'Poppins-SemiBold' }}>
                                        {statusStyle.label}
                                    </Text>
                                </View>
                            </View>

                            {/* Date and Feedback Info */}
                            <View className="flex-row items-center gap-4 mb-4">
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Inter-Regular' }}>
                                        {item.consultation_date}
                                    </Text>
                                </View>
                                {item.hasFeedback && (
                                    <View className="flex-row items-center gap-1.5">
                                        <Ionicons name="star" size={14} color="#F59E0B" />
                                        <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Inter-Regular' }}>
                                            {item.rating}/5
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* View Appointment Button */}
                            <TouchableOpacity
                                className="bg-[#1C2A48] rounded-xl py-3 flex-row items-center justify-center gap-2"
                                onPress={() => setSelectedAppointment(item)}
                            >
                                <Text className="text-white text-sm font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                                    View Appointment
                                </Text>
                                <Ionicons name="chevron-forward" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {/* Empty State */}
                {!loading && filteredData.length === 0 && (
                    <View className="bg-white rounded-2xl p-12 items-center">
                        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 text-center mt-3" style={{ fontFamily: 'Inter-Regular' }}>
                            No records found
                        </Text>
                    </View>
                )}

                <View className="h-24" />
            </ScrollView>

            <HistoryModal
                visible={!!selectedAppointment}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
            />
        </View>
    );
}