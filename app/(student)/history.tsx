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
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">History Page</Text>
            </View>
        </SafeAreaView>
    );
}
