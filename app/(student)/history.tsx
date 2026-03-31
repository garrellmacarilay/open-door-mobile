import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HistoryModal from '../../components/student/HistoryModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Dummy Data
const HISTORY_DATA = [
    {
        id: 'APPT-129',
        title: 'Medical Services',
        date: '03-10-2026',
        time: '10:00 AM',
        status: 'completed'
    },
    {
        id: 'APPT-132',
        title: 'Student Organization',
        date: '03-12-2026',
        time: '10:00 AM',
        status: 'pending'
    },
    {
        id: 'APPT-130',
        title: 'Student Internship',
        date: '03-14-2026',
        time: '10:00 AM',
        status: 'declined'
    },
    {
        id: 'APPT-131',
        title: 'Student Publication',
        date: '03-16-2026',
        time: '10:00 AM',
        status: 'approved'
    }
];

type FilterStatus = 'all' | 'pending' | 'approved' | 'completed' | 'declined';

export default function History() {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
            case 'approved': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' };
            case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' };
            case 'declined': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Unknown' };
        }
    };

    const filteredData = activeFilter === 'all'
        ? HISTORY_DATA
        : HISTORY_DATA.filter(item => item.status === activeFilter);

    const FilterButton = ({ label, value }: { label: string; value: FilterStatus }) => {
        const isActive = activeFilter === value;
        return (
            <TouchableOpacity
                onPress={() => setActiveFilter(value)}
                className={`px-4 py-2 rounded-full mr-2 ${isActive ? 'bg-[#1C2A48]' : 'bg-white border border-gray-200'}`}
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
                            Appointments
                        </Text>
                        <Text className="text-[#1C2A48] text-xs font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                            Consultation History
                        </Text>
                    </View>
                   
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
            <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
                {filteredData.map((item, index) => {
                    const statusStyle = getStatusStyle(item.status);
                    return (
                        <View key={index} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                            {/* Header with ID and Status */}
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs mb-1" style={{ fontFamily: 'Inter-Regular' }}>
                                        {item.id}
                                    </Text>
                                    <Text className="text-[#1C2A48] text-base font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                                        {item.title}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                                    <Text className={`text-xs font-semibold ${statusStyle.text}`} style={{ fontFamily: 'Poppins-SemiBold' }}>
                                        {statusStyle.label}
                                    </Text>
                                </View>
                            </View>

                            {/* Date and Time */}
                            <View className="flex-row items-center gap-4 mb-4">
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Inter-Regular' }}>
                                        {item.date}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-xs" style={{ fontFamily: 'Inter-Regular' }}>
                                        {item.time}
                                    </Text>
                                </View>
                            </View>

                            {/* View Appointment Button */}
                            <TouchableOpacity
                                className="bg-[#18233D] rounded-xl py-3 flex-row items-center justify-center gap-2"
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

                {filteredData.length === 0 && (
                    <View className="bg-white rounded-2xl p-12 items-center">
                        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 text-center mt-3" style={{ fontFamily: 'Inter-Regular' }}>
                            No records found
                        </Text>
                    </View>
                )}

                {/* Padding for bottom nav */}
                <View style={{ height: Math.max(insets.bottom + 80, 112) }} />
            </ScrollView>

            <HistoryModal
                visible={!!selectedAppointment}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
            />
        </View>
    );
}
