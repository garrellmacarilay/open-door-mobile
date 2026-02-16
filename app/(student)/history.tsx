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
        </SafeAreaView>
    );
}
