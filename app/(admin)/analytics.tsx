import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, type DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STATS = [
    { label: 'Total Appointments', value: '156' },
    { label: 'Approved', value: '98' },
    { label: 'Approved Rate', value: '62%' },
    { label: 'Declined', value: '12' },
];

const APPOINTMENT_STATUS = [
    { label: 'Approved', color: '#10B981', count: 98, percentage: 82.0 },
    { label: 'Completed', color: '#3B82F6', count: 21, percentage: 18.3 },
    { label: 'Pending', color: '#F59E0B', count: 25, percentage: 18.0 },
    { label: 'Declined', color: '#EF4444', count: 12, percentage: 9.7 },
];

const APPOINTMENT_STATUS_CARDS = [
    { label: 'Approved', color: '#14C7A1', backgroundColor: '#EAF8F1' },
    { label: 'Completed', color: '#4A7FF7', backgroundColor: '#EEF3FF' },
    { label: 'Declined', color: '#FF4B5C', backgroundColor: '#FDEEEE' },
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

const OFFICE_FEEDBACK = [
    {
        id: 1,
        office: 'Student Organization',
        rating: 4.5,
        reviews: 23,
        feedback: [
            'Very helpful and professional staff',
            'Quick response time and clear guidance',
        ],
    },
    {
        id: 2,
        office: 'Student Internship',
        rating: 4.5,
        reviews: 23,
        feedback: [
            'Very helpful and professional staff',
            'Quick response time and clear guidance',
        ],
    },
    {
        id: 3,
        office: 'Medical Services',
        rating: 4.5,
        reviews: 23,
        feedback: [
            'Very helpful and professional staff',
            'Quick response time and clear guidance',
        ],
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <View className="flex-row gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rating >= star;
                const half = !filled && rating >= star - 0.5;
                return (
                    <Ionicons
                        key={star}
                        name={filled ? 'star' : half ? 'star-half' : 'star-outline'}
                        size={16}
                        color="#F59E0B"
                    />
                );
            })}
        </View>
    );
}

export default function AdminAnalyticsPage() {
    const insets = useSafeAreaInsets();
    const appointmentStatusCards = APPOINTMENT_STATUS_CARDS.map((card) => {
        const status = APPOINTMENT_STATUS.find((item) => item.label === card.label);
        return {
            ...card,
            count: status?.count ?? 0,
        };
    });
    const maxAppointmentStatusCount = Math.max(...appointmentStatusCards.map((item) => item.count), 1);

    const handleExportPDF = () => {
        Alert.alert('Export PDF', 'PDF export functionality coming soon');
    };

    return (
        <View className="flex-1 bg-[#EEF1F5]">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
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
                        className="bg-[#13244F] rounded-[10px] px-4 py-3 flex-row items-center gap-2"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="document-text-outline" size={16} color="white" />
                        <Text className="text-white font-bold text-[14px]">Export PDF</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-4 pt-4">
                    {/* Stats Cards */}
                    <View className="flex-row gap-2 mb-6">
                        {STATS.map((stat, index) => (
                            <View
                                key={index}
                                className="flex-1 bg-[#13244F] rounded-[10px] px-2 py-3 items-center"
                            >
                                <Text className="text-white text-[30px] leading-[42px] font-extrabold mb-1">
                                    {stat.value}
                                </Text>
                                <Text className="text-[#C8D0E3] text-[10px] font-semibold text-center leading-[12px]">
                                    {stat.label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Appointments per Status */}
                    <View
                        className="bg-white rounded-[22px] p-5 mb-6 border border-[#E5E7EB]"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <View className="flex-row items-start gap-3 mb-2">
                            <View className="w-1 h-7 rounded-full bg-[#4387FF] mt-0.5" />
                            <View>
                                <Text className="text-[#1F2937] text-[16px] font-extrabold mb-1">
                                    Appointments per status
                                </Text>
                                <Text className="text-[#9CA3AF] text-[11px] font-semibold">
                                    Total of 156 appointments
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row mb-5 mt-3 h-5 rounded-full overflow-hidden bg-[#F3F4F6]">
                            {appointmentStatusCards.map((status, index) => (
                                <View
                                    key={status.label}
                                    style={{
                                        flex: status.count,
                                        backgroundColor: status.color,
                                        marginRight: index === appointmentStatusCards.length - 1 ? 0 : 1,
                                    }}
                                />
                            ))}
                        </View>

                        <View className="flex-row gap-3">
                            {appointmentStatusCards.map((status) => {
                                const barWidth: DimensionValue = `${Math.max((status.count / maxAppointmentStatusCount) * 100, 25)}%`;

                                return (
                                    <View
                                        key={status.label}
                                        className="flex-1 rounded-[14px] px-3 py-4"
                                        style={{ backgroundColor: status.backgroundColor }}
                                    >
                                        <Text
                                            className="text-[14px] font-bold mb-3"
                                            style={{ color: status.color }}
                                        >
                                            {status.label}
                                        </Text>
                                        <Text className="text-[#111827] text-[20px] font-extrabold mb-4">
                                            {status.count}
                                        </Text>
                                        <View className="h-1.5 bg-white/80 rounded-full overflow-hidden">
                                            <View
                                                className="h-full rounded-full"
                                                style={{
                                                    width: barWidth,
                                                    backgroundColor: status.color,
                                                }}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Common Reasons for Visit */}
                    <View className="bg-white rounded-[16px] p-5 mb-6 border border-gray-100">
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
                    {/* Office Feedback */}
                    <View className="mb-6">
                        <View className="flex-row items-center gap-2 mb-4">
                            <View className="w-1 h-5 bg-[#F59E0B] rounded-full" />
                            <Text className="text-[#1C274C] text-[18px] font-extrabold">
                                Office Feedback
                            </Text>
                        </View>

                        {OFFICE_FEEDBACK.map((item) => (
                            <View
                                key={item.id}
                                className="bg-white rounded-[16px] p-5 mb-4 border border-gray-100"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.04,
                                    shadowRadius: 4,
                                    elevation: 1,
                                }}
                            >
                                {/* Office Name */}
                                <Text className="text-[#1C274C] text-[15px] font-extrabold mb-2">
                                    {item.office}
                                </Text>

                                {/* Stars + Rating + Review Count */}
                                <View className="flex-row items-center gap-2 mb-3">
                                    <StarRating rating={item.rating} />
                                    <Text className="text-[#1C274C] text-[13px] font-bold">
                                        {item.rating.toFixed(1)}
                                    </Text>
                                    <Text className="text-gray-400 text-[12px] font-medium">
                                        ({item.reviews} reviews)
                                    </Text>
                                </View>

                                {/* Recent Feedback Label */}
                                <Text className="text-[#1C274C] text-[13px] font-bold mb-2">
                                    Recent Feedback
                                </Text>

                                {/* Feedback Quotes */}
                                {item.feedback.map((text, i) => (
                                    <View
                                        key={i}
                                        className="bg-gray-50 border border-gray-100 rounded-[10px] px-4 py-3 mb-2"
                                    >
                                        <Text className="text-gray-600 text-[12px] font-medium">
                                            {text}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View style={{ height: Math.max(insets.bottom + 80, 112) }} />
                </View>
            </ScrollView>
        </View>
    );
}
