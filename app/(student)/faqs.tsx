import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
}

export default function FAQs() {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const faqs: FAQ[] = [
        {
            id: 1,
            category: "Appointments",
            question: "Where is the Prefect of Student Affairs and Services located?",
            answer: "The Prefect of Student Affairs and Services office is located on the second floor of the main administrative building, Room 201. Office hours are Monday to Friday, 8:00 AM to 5:00 PM."
        },
        {
            id: 2,
            category: "Process",
            question: "What happens if my appointment is declined?",
            answer: "If your appointment is declined, you will receive a notification with the reason. You can then reschedule by selecting a different date and time, or contact the office directly for assistance in finding a suitable appointment slot."
        },
        {
            id: 3,
            category: "Support",
            question: "Can I bring my classmates?",
            answer: "Yes, you can bring classmates to group consultations or workshops. However, for individual counseling sessions, appointments are typically one-on-one unless you specifically request a group session when booking."
        },
        {
            id: 4,
            category: "Process",
            question: "How early should I book an appointment?",
            answer: "Appointments must be scheduled at least 2 days before the scheduled date. This allows the office to properly prepare and ensure availability of staff members for your consultation."
        },
        {
            id: 5,
            category: "Support",
            question: "How can I set an appointment?",
            answer: "You can set an appointment by clicking on the 'Book Consultation' button in your dashboard, selecting your preferred office, choosing an available date and time, and providing the purpose of your consultation."
        },
        {
            id: 6,
            category: "Appointments",
            question: "What services does the office offer?",
            answer: "The office provides various services including academic support, counseling services, health services, student organization management, library resources, IT support, and communication assistance for student activities and events."
        }
    ];

    const toggleFAQ = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="px-6 pt-4 pb-6 bg-white border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-3xl font-bold text-[#1F3463]">Help Center</Text>
                    <View className="w-10 h-10 rounded-full bg-[#1F3463] items-center justify-center">
                        <Ionicons name="help-circle-outline" size={24} color="#ffffff" />
                    </View>
                </View>
                <Text className="text-sm text-gray-500">Student Support & FAQs</Text>
            </View>

            {/* FAQ List */}
            <ScrollView
                className="flex-1 bg-gray-50"
                showsVerticalScrollIndicator={false}
            >
                <View className="px-6 py-4">
                    {faqs.map((faq) => (
                        <View key={faq.id} className="mb-3">
                            {/* Category Label */}
                            <Text className="text-xs font-medium text-gray-400 uppercase mb-2 ml-1">
                                {faq.category}
                            </Text>

                            {/* FAQ Card */}
                            <TouchableOpacity
                                onPress={() => toggleFAQ(faq.id)}
                                activeOpacity={0.7}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 3,
                                    elevation: 2,
                                }}
                            >
                                {/* Question */}
                                <View className="flex-row items-center justify-between px-5 py-4">
                                    <Text
                                        className="flex-1 text-[15px] font-semibold text-gray-800 mr-3"
                                        style={{ lineHeight: 22 }}
                                    >
                                        {faq.question}
                                    </Text>

                                    {/* Chevron Icon */}
                                    <View
                                        className="transition-transform duration-200"
                                        style={{
                                            transform: [{ rotate: expandedId === faq.id ? '180deg' : '0deg' }]
                                        }}
                                    >
                                        <Ionicons
                                            name="chevron-down"
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </View>
                                </View>

                                {/* Answer - Expandable */}
                                {expandedId === faq.id && (
                                    <View className="px-5 pb-5 pt-1 border-t border-gray-100">
                                        <Text
                                            className="text-[14px] text-gray-600 leading-6"
                                        >
                                            {faq.answer}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Bottom Spacing */}
                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}
