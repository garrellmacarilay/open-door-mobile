import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HistoryModal from '../../components/staff/StaffHistoryModal';

const HISTORY_DATA = [
    {
        id: '21 - 0007/IMTC',
        title: 'Student Organization',
        date: '2026-02-20',
        time: '10:00 AM',
        status: 'approved',
    },
    {
        id: '22 - 0007/IMTC',
        title: 'Student Internship',
        date: '2026-12-10',
        time: '10:00 AM',
        status: 'pending',
    },
    {
        id: '23 - 0007/IMTC',
        title: 'Student Publication',
        date: '2026-04-20',
        time: '10:00 AM',
        status: 'declined',
    },
    {
        id: '24 - 0007/IMTC',
        title: 'Medical Services',
        date: '2026-04-20',
        time: '10:00 AM',
        status: 'completed',
    },
];

type FilterStatus = 'all' | 'pending' | 'approved' | 'completed' | 'declined';

export default function AdminHistory() {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
            case 'approved':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' };
            case 'completed':
                return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' };
            case 'declined':
                return { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Unknown' };
        }
    };

    const filteredData =
        activeFilter === 'all' ? HISTORY_DATA : HISTORY_DATA.filter((item) => item.status === activeFilter);

    const FilterButton = ({ label, value }: { label: string; value: FilterStatus }) => {
        const isActive = activeFilter === value;
        return (
            <TouchableOpacity
                onPress={() => setActiveFilter(value)}
                className={`px-4 py-2 rounded-lg mr-2 ${
                    isActive ? 'bg-[#7C3AED]' : 'bg-white border border-gray-200'
                }`}
            >
                <Text
                    className={`text-xs font-semibold ${
                        isActive ? 'text-white' : 'text-gray-600'
                    }`}
                >
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
                        <Text className="text-[#1C2A48] text-2xl font-bold mb-1">Records</Text>
                        <Text className="text-gray-500 text-xs">Consultation History</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 items-center justify-center bg-[#7C3AED] rounded-lg">
                        <Ionicons name="calendar-outline" size={20} color="white" />
                    </TouchableOpacity>
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
                {filteredData.map((item, index) => {
                    const statusStyle = getStatusStyle(item.status);
                    return (
                        <View key={index} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                            {/* Header with ID and Status */}
                            <View className="flex-row items-start justify-between mb-3">
                                <View className="flex-1">
                                    <Text className="text-gray-500 text-xs mb-1">{item.id}</Text>
                                    <Text className="text-[#1C2A48] text-base font-bold">{item.title}</Text>
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
                                    <Text className="text-gray-600 text-xs">{item.date}</Text>
                                </View>
                                <View className="flex-row items-center gap-1.5">
                                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-xs">{item.time}</Text>
                                </View>
                            </View>

                            {/* View Appointment Button */}
                            <TouchableOpacity
                                className="bg-[#7C3AED] rounded-xl py-3 flex-row items-center justify-center gap-2"
                                onPress={() => setSelectedAppointment(item)}
                            >
                                <Text className="text-white text-sm font-semibold">View Appointment</Text>
                                <Ionicons name="chevron-forward" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {filteredData.length === 0 && (
                    <View className="bg-white rounded-2xl p-12 items-center">
                        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 text-center mt-3">No records found</Text>
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
