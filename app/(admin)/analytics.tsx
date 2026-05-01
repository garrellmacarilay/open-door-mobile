import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, type DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGenerateReport, useConsultationStats, useServiceDistribution, useOfficesFeedback } from '@/hooks/adminHooks';

/**
 * 1. UI Configuration - Kept separate from business logic
 */
const STATUS_CONFIG = {
    approved: { label: 'Approved', color: '#10B981', backgroundColor: '#EAF8F1', iconColor: '#14C7A1' },
    completed: { label: 'Completed', color: '#3B82F6', backgroundColor: '#EEF3FF', iconColor: '#4A7FF7' },
    declined: { label: 'Declined', color: '#EF4444', backgroundColor: '#FDEEEE', iconColor: '#FF4B5C' },
    pending: { label: 'Pending', color: '#F59E0B', backgroundColor: '#FFF7ED', iconColor: '#F59E0B' },
};

// Mock data remains for now if not provided by API
const COMMON_REASONS = [
    { id: 1, label: 'Academic Advising', count: 45, color: '#6366F1' },
    { id: 2, label: 'Career Counseling', count: 38, color: '#06B6D4' },
    { id: 3, label: 'Financial Aid', count: 32, color: '#10B981' },
    { id: 4, label: 'Mental Health', count: 25, color: '#A855F7' },
    { id: 5, label: 'Tech Support', count: 16, color: '#F59E0B' },
    { id: 6, label: 'Counseling', count: 14, color: '#EC4899' },
    { id: 7, label: 'Registration', count: 13, color: '#8B5CF6' },
];

const OFFICE_FEEDBACK = [
    {
        id: 1,
        office: 'Student Organization',
        rating: 4.5,
        reviews: 23,
        feedback: ['Very helpful and professional staff', 'Quick response time and clear guidance'],
    },
    { id: 2, office: 'Student Internship', rating: 4.5, reviews: 23, feedback: ['Very helpful...', 'Quick response...'] },
    { id: 3, office: 'Medical Services', rating: 4.5, reviews: 23, feedback: ['Very helpful...', 'Quick response...'] },
];

export default function AdminAnalyticsPage() {
    const insets = useSafeAreaInsets();
    const [currentDate, setCurrentDate] = useState(new Date());

    const { stats, loading } = useConsultationStats(currentDate);
    const { generateReport, isGenerating } = useGenerateReport(currentDate);
    const { distribution, loading: distLoading } = useServiceDistribution(currentDate);
    const { officeFeedback, loading: isLoading, error} = useOfficesFeedback(currentDate);

    const isPageLoading = loading || distLoading || isLoading;

    const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const isCurrentMonth = 
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

    const goToPrevMonth = () => {
        setCurrentDate(prev => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() - 1);
            return d;
        });
    };

    const goToNextMonth = () => {
        if (isCurrentMonth) return; // don't go beyond current month
        setCurrentDate(prev => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() + 1);
            return d;
        });
    };

    const MAX_OFFICE_COUNT = useMemo(() => {
        return distribution.length > 0 
            ? Math.max(...distribution.map(d => d.count )) 
            : 1;
    }, [distribution]);

    /**
     * 2. Derived Logic - Transform API stats into UI-ready data
     */
    const { appointmentStatusCards, maxStatusCount, topStats } = useMemo(() => {
        // Map the keys we care about in the bar charts (Approved, Completed, Declined)
        const keys = ['approved', 'completed', 'declined'] as const;
        
        const cards = keys.map(key => ({
            ...STATUS_CONFIG[key],
            count: stats?.[key] ?? 0,
            percentage: stats?.percentages?.[key] ?? 0
        }));

        const maxCount = Math.max(...cards.map(c => c.count), 1);

        const summaryStats = [
            { label: 'Total Appointments', value: stats?.total ?? 0 },
            { label: 'Approved', value: stats?.approved ?? 0 },
            { label: 'Approved Rate', value: `${stats?.percentages?.approved ?? 0}%` },
            { label: 'Declined', value: stats?.declined ?? 0 },
        ];

        return { 
            appointmentStatusCards: cards, 
            maxStatusCount: maxCount,
            topStats: summaryStats 
        };
    }, [stats]);

    const MAX_REASON_COUNT = useMemo(() => Math.max(...COMMON_REASONS.map((r) => r.count)), []);

    /**
     * 3. Action Handlers
     */
    const handleExportPDF = () => generateReport();

    if (loading && !stats) {
        return (
            <View className="flex-1 justify-center items-center bg-[#EEF1F5]">
                <ActivityIndicator size="large" color="#13244F" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#EEF1F5]">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
                    <View>
                        <Text className="text-[#1C274C] text-[26px] font-extrabold mb-1">Analytics</Text>
                        <Text className="text-gray-500 text-[13px] font-semibold">Performance Insights</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleExportPDF}
                        disabled={isGenerating}
                        className="bg-[#13244F] rounded-[10px] px-4 py-3 flex-row items-center gap-2"
                        activeOpacity={0.8}
                    >
                        {isGenerating ? (
                            <>
                                <ActivityIndicator size="small" color="white" />
                                <Text className="text-white font-bold text-[14px]">Exporting...</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="document-text-outline" size={16} color="white" />
                                <Text className="text-white font-bold text-[14px]">Export PDF</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View className='flex-row px-4 pt-4 justify-between ml-4'>
                    <TouchableOpacity onPress={goToPrevMonth}>
                        <View className='flex-row items-center'>
                            <Ionicons name="arrow-back" size={24} color="black" />
                            <Text className='text-black text-[12px]'>Previous Month</Text>
                        </View>
                    </TouchableOpacity>

                    <Text className='text-[#1C274C] font-bold text-[13px]'>{monthLabel}</Text>

                    <TouchableOpacity onPress={goToNextMonth} disabled={isCurrentMonth}>
                        <View className='flex-row items-center'>
                            <Text className='text-black text-[12px]'>Next Month</Text>
                            <Ionicons name="arrow-forward" size={20} color={isCurrentMonth ? '#D1D5DB' : 'black'} />
                        </View>
                    </TouchableOpacity>
                </View>
                
                {isPageLoading ? (
                    <View className="flex-1 items-center justify-center py-32">
                        <ActivityIndicator size="large" color="#13244F" />
                    </View>
                ) : (
                    <View className="px-4 pt-4">
                    {/* Stats Cards */}
                        <View className="flex-row gap-2 mb-6">
                            {topStats.map((stat, index) => (
                                <View key={index} className="flex-1 bg-[#13244F] rounded-[10px] px-2 py-3 items-center">
                                    <Text className="text-white text-[20px] leading-[42px] font-extrabold mb-1">{stat.value}</Text>
                                    <Text className="text-[#C8D0E3] text-[10px] font-semibold text-center leading-[12px]">{stat.label}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Appointments per Status Section */}
                        <View className="bg-white rounded-[22px] p-5 mb-6 border border-[#E5E7EB] shadow-sm elevation-1">
                            <View className="flex-row items-start gap-3 mb-2">
                                <View className="w-1 h-7 rounded-full bg-[#4387FF] mt-0.5" />
                                <View>
                                    <Text className="text-[#1F2937] text-[16px] font-extrabold mb-1">Appointments per status</Text>
                                    <Text className="text-[#9CA3AF] text-[11px] font-semibold">
                                        Total of {stats?.total ?? 0} appointments
                                    </Text>
                                </View>
                            </View>

                            {/* Multi-color Horizontal Bar */}
                            <View className="flex-row mb-5 mt-3 h-5 rounded-full overflow-hidden bg-[#F3F4F6]">
                                {appointmentStatusCards.map((status, index) => (
                                    <View
                                        key={status.label}
                                        style={{
                                            flex: status.count || 0.1, // Small flex if 0 to show line
                                            backgroundColor: status.color,
                                            marginRight: index === appointmentStatusCards.length - 1 ? 0 : 1,
                                        }}
                                    />
                                ))}
                            </View>

                            {/* Status Grid */}
                            <View className="flex-row gap-3">
                                {appointmentStatusCards.map((status) => {
                                    const barWidth: DimensionValue = `${Math.max((status.count / maxStatusCount) * 100, 15)}%`;
                                    return (
                                        <View key={status.label} className="flex-1 rounded-[14px] px-3 py-4" style={{ backgroundColor: status.backgroundColor }}>
                                            <Text className="text-[14px] font-bold mb-3" style={{ color: status.color }}>{status.label}</Text>
                                            <Text className="text-[#111827] text-[20px] font-extrabold mb-4">{status.count}</Text>
                                            <View className="h-1.5 bg-white/80 rounded-full overflow-hidden">
                                                <View className="h-full rounded-full" style={{ width: barWidth, backgroundColor: status.color }} />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Office Feedback Section */}
                        <View className="mb-6">
                            <View className="flex-row items-center gap-2 mb-4">
                                <View className="w-1 h-5 bg-[#F59E0B] rounded-full" />
                                <Text className="text-[#1C274C] text-[18px] font-extrabold">Office Feedback</Text>
                            </View>

                            {officeFeedback.map((item) => (
                                <View key={item.id} className="bg-white rounded-[16px] p-5 mb-4 border border-gray-100 shadow-sm elevation-1">
                                    <Text className="text-[#1C274C] text-[15px] font-extrabold mb-2">{item.office}</Text>
                                    <View className="flex-row items-center gap-2 mb-3">
                                        <StarRating rating={item.rating} />
                                        <Text className="text-[#1C274C] text-[13px] font-bold">{item.rating.toFixed(1)}</Text>
                                        <Text className="text-gray-400 text-[12px] font-medium">({item.reviews} reviews)</Text>
                                    </View>
                                    <Text className="text-[#1C274C] text-[13px] font-bold mb-2">Recent Feedback</Text>
                                    {item.feedback.map((text, i) => (
                                        <View key={i} className="bg-gray-50 border border-gray-100 rounded-[10px] px-4 py-3 mb-2">
                                            <Text className="text-gray-600 text-[12px] font-medium">{text}</Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>

                        {/* Common Reasons Section */}
                        <View className="bg-white rounded-[22px] p-5 mb-6 border border-[#E5E7EB] shadow-sm elevation-1">
                            <View className="flex-row items-start gap-3 mb-5">
                                <View className="w-1 h-7 rounded-full bg-[#E400D9] mt-0.5" />
                                <View>
                                    <Text className="text-[#1F2937] text-[16px] font-extrabold mb-1">Offices that were commonly visited</Text>
                                    <Text className="text-[#7B7280] text-[11px] font-semibold">Top consultation categories</Text>
                                </View>
                            </View>
                                
                        {distLoading ? (
                                <ActivityIndicator color="#E400D9" className="py-10" />
                            ) : (
                                distribution.map((item, index) => {
                                    // Logic: (Current Office Count / Highest Office Count) * 100
                                    const barWidth: DimensionValue = `${Math.max((item.count / MAX_OFFICE_COUNT) * 100, 18)}%`;
                                    
                                    return (
                                        <View key={index} className={index === distribution.length - 1 ? '' : 'mb-5'}>
                                            <View className="flex-row items-start gap-4">
                                                {/* Rank Badge */}
                                                <View 
                                                    className="w-8 h-8 rounded-[10px] items-center justify-center" 
                                                    style={{ backgroundColor: item.color }}
                                                >
                                                    <Text className="text-white text-[18px] font-extrabold leading-[20px]">
                                                        {index + 1}
                                                    </Text>
                                                </View>

                                                <View className="flex-1 pt-0.5">
                                                    <View className="flex-row items-center justify-between mb-2">
                                                        <Text className="text-[#6B7280] text-[13px] font-extrabold flex-1 pr-3">
                                                            {item.label}
                                                        </Text>
                                                        <Text className="text-[#4B5563] text-[13px] font-extrabold">
                                                            {item.count}
                                                        </Text>
                                                    </View>

                                                    {/* Dynamic Bar */}
                                                    <View className="h-3 bg-[#F1F2F4] rounded-full overflow-hidden">
                                                        <View 
                                                            className="h-full rounded-full" 
                                                            style={{ 
                                                                width: barWidth, 
                                                                backgroundColor: item.color 
                                                            }} 
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>

                        <View style={{ height: Math.max(insets.bottom + 80, 112) }} />
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

// Sub-component for Stars
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
