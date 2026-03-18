import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATS = [
    { label: 'Total Appointments', value: '156' },
    { label: 'Approved', value: '98' },
    { label: 'Completion Rate', value: '62%' },
    { label: 'Canceled', value: '12' },
];

const APPOINTMENT_STATUS = [
    { label: 'Approved', color: '#10B981', count: 98, percentage: 82.0 },
    { label: 'Completed', color: '#3B82F6', count: 21, percentage: 18.3 },
    { label: 'Pending', color: '#F59E0B', count: 25, percentage: 18.0 },
    { label: 'Declined', color: '#EF4444', count: 12, percentage: 9.7 },
];

const COMMON_REASONS = [
    { id: 1, label: 'Academic Advising', count: 45, color: '#6366F1' },
    { id: 2, label: 'Career Counseling', count: 38, color: '#06B6D4' },
    { id: 3, label: 'Financial Aid', count: 32, color: '#10B981' },
    { id: 4, label: 'Mental Health', count: 25, color: '#A855F7' },
    { id: 5, label: 'Tech Support', count: 16, color: '#F59E0B' },
    { id: 6, label: 'Counseling', count: 14, color: '#EC4899' },
    { id: 7, label: 'Registration', count: 13, color: '#8B5CF6' },
];

const MAX_REASON_COUNT = Math.max(...COMMON_REASONS.map((r) => r.count));
const TOTAL_VISITS = COMMON_REASONS.reduce((sum, r) => sum + r.count, 0);

export default function AdminAnalyticsPage() {
    const handleExportPDF = () => {
        Alert.alert('Export PDF', 'PDF export functionality coming soon');
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="bg-white px-6 pt-6 pb-5 border-b border-gray-100 flex-row items-center justify-between">
                    <View>
                        <Text className="text-[#1C274C] text-[26px] font-extrabold mb-1">
                            Analytics
                        </Text>
                        <Text className="text-gray-500 text-[13px] font-semibold">
                            Performance Insights
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleExportPDF}
                        className="bg-[#1C274C] rounded-[8px] px-4 py-2 flex-row items-center gap-2"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="download" size={16} color="white" />
                        <Text className="text-white font-bold text-[12px]">Export PDF</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-6 pt-6">
                    {/* Stats Cards */}
                    <View className="flex-row flex-wrap gap-3 mb-8">
                        {STATS.map((stat, index) => (
                            <View
                                key={index}
                                className="flex-1 min-w-[46%] bg-[#1C274C] rounded-[12px] p-4"
                            >
                                <Text className="text-gray-300 text-[12px] font-semibold mb-2">
                                    {stat.label}
                                </Text>
                                <Text className="text-white text-[24px] font-extrabold">
                                    {stat.value}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Appointments per Status */}
                    <View className="bg-white rounded-[16px] p-5 mb-6 border border-gray-100">
                        <Text className="text-[#1C274C] text-[16px] font-extrabold mb-1">
                            Appointments per Status
                        </Text>
                        <Text className="text-gray-500 text-[12px] font-semibold mb-4">
                            Total of 156 appointments
                        </Text>

                        {/* Status Bar Chart */}
                        <View className="flex-row gap-1 mb-6 h-6 rounded-full overflow-hidden bg-gray-100">
                            {APPOINTMENT_STATUS.map((status) => (
                                <View
                                    key={status.label}
                                    style={{
                                        flex: status.percentage,
                                        backgroundColor: status.color,
                                    }}
                                    className="rounded-full"
                                />
                            ))}
                        </View>

                        {/* Status Legend */}
                        <View className="flex-row flex-wrap gap-6">
                            <View className="flex-1">
                                <View className="flex-row items-center gap-2 mb-1">
                                    <View
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: '#10B981' }}
                                    />
                                    <Text className="text-[#10B981] text-[12px] font-bold uppercase">
                                        Approved
                                    </Text>
                                </View>
                                <Text className="text-[#1C274C] text-[18px] font-extrabold">
                                    {APPOINTMENT_STATUS[0].count}
                                </Text>
                                <Text className="text-gray-500 text-[11px] font-semibold">
                                    {APPOINTMENT_STATUS[0].percentage.toFixed(1)}% of total
                                </Text>
                            </View>

                            <View className="flex-1">
                                <View className="flex-row items-center gap-2 mb-1">
                                    <View
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: '#3B82F6' }}
                                    />
                                    <Text className="text-[#3B82F6] text-[12px] font-bold uppercase">
                                        Completed
                                    </Text>
                                </View>
                                <Text className="text-[#1C274C] text-[18px] font-extrabold">
                                    {APPOINTMENT_STATUS[1].count}
                                </Text>
                                <Text className="text-gray-500 text-[11px] font-semibold">
                                    {APPOINTMENT_STATUS[1].percentage.toFixed(1)}% of total
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row flex-wrap gap-6 mt-4">
                            <View className="flex-1">
                                <View className="flex-row items-center gap-2 mb-1">
                                    <View
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: '#F59E0B' }}
                                    />
                                    <Text className="text-[#F59E0B] text-[12px] font-bold uppercase">
                                        Pending
                                    </Text>
                                </View>
                                <Text className="text-[#1C274C] text-[18px] font-extrabold">
                                    {APPOINTMENT_STATUS[2].count}
                                </Text>
                                <Text className="text-gray-500 text-[11px] font-semibold">
                                    {APPOINTMENT_STATUS[2].percentage.toFixed(1)}% of total
                                </Text>
                            </View>

                            <View className="flex-1">
                                <View className="flex-row items-center gap-2 mb-1">
                                    <View
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: '#EF4444' }}
                                    />
                                    <Text className="text-[#EF4444] text-[12px] font-bold uppercase">
                                        Declined
                                    </Text>
                                </View>
                                <Text className="text-[#1C274C] text-[18px] font-extrabold">
                                    {APPOINTMENT_STATUS[3].count}
                                </Text>
                                <Text className="text-gray-500 text-[11px] font-semibold">
                                    {APPOINTMENT_STATUS[3].percentage.toFixed(1)}% of total
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Common Reasons for Visit */}
                    <View className="bg-white rounded-[16px] p-5 mb-8 border border-gray-100">
                        <Text className="text-[#1C274C] text-[16px] font-extrabold mb-1">
                            Common Reasons for Visit
                        </Text>
                        <Text className="text-gray-500 text-[12px] font-semibold mb-5">
                            Top consultation categories
                        </Text>

                        {/* Reasons List */}
                        {COMMON_REASONS.map((reason, index) => {
                            const barWidth = (reason.count / MAX_REASON_COUNT) * 100;
                            return (
                                <View key={reason.id} className="mb-5">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="flex-row items-center gap-2 flex-1">
                                            <View
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: reason.color }}
                                            />
                                            <Text className="text-[#1C274C] text-[13px] font-semibold flex-1">
                                                {reason.label}
                                            </Text>
                                        </View>
                                        <Text className="text-[#1C274C] text-[12px] font-extrabold">
                                            {reason.count}
                                        </Text>
                                    </View>
                                    <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <View
                                            style={{
                                                width: `${barWidth}%`,
                                                backgroundColor: reason.color,
                                            }}
                                            className="h-full rounded-full"
                                        />
                                    </View>
                                </View>
                            );
                        })}

                        {/* Total Visits */}
                        <View className="mt-4 pt-4 border-t border-gray-100 flex-row justify-between">
                            <Text className="text-gray-500 text-[12px] font-semibold">
                                Total visits tracked
                            </Text>
                            <Text className="text-[#1C274C] text-[14px] font-extrabold">
                                {TOTAL_VISITS}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
