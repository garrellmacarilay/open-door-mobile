import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Dummy Data
const HISTORY_DATA = [
    {
        id: '21 - 0007/IMTC',
        title: 'Student Organization',
        date: '2026-2-20',
        time: '10:00 AM',
        status: 'approved'
    },
    {
        id: '22 - 0007/IMTC',
        title: 'Student Internship',
        date: '2026-12-10',
        time: '10:00 AM',
        status: 'pending'
    },
    {
        id: '23 - 0007/IMTC',
        title: 'Student Publication',
        date: '2026-14-20',
        time: '10:00 AM',
        status: 'declined'
    },
    {
        id: '23 - 0007/IMTC',
        title: 'Medical Services',
        date: '2026-14-20',
        time: '10:00 AM',
        status: 'completed'
    }
];

type FilterStatus = 'all' | 'pending' | 'approved' | 'completed' | 'declined';

export default function History() {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

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
                className={`px-4 py-2 rounded-lg ${isActive ? 'bg-[#1C2A48]' : 'bg-white border border-gray-200'}`}
            >
                <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`} style={{ fontFamily: 'Inter-SemiBold' }}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

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
                    <TouchableOpacity className="w-10 h-10 items-center justify-center bg-[#1C2A48] rounded-lg">
                        <Ionicons name="calendar-outline" size={20} color="white" />
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
        </SafeAreaView>
    );
}
