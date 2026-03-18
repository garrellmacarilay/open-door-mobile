import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';

const DUMMY_APPOINTMENTS = [
    {
        id: 1,
        title: "Academic Advising Session",
        details: {
            student: "John Doe",
            office: "Guidance",
            status: "pending",
            service_type: "Academic Consultation"
        },
        dateString: "December 15, 2025",
        time: "10:00 AM"
    },
    {
        id: 2,
        title: "Career Planning Meeting",
        details: {
            student: "Jane Smith",
            office: "Student Internship",
            status: "approved",
            service_type: "Career Guidance"
        },
        dateString: "December 16, 2025",
        time: "2:30 PM"
    }
];

export default function OfficeDashboard() {
    const [appointments] = useState(DUMMY_APPOINTMENTS);

    const filteredAppointments = appointments;

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                {/* Title Section */}
                <View className="px-6 pt-5 pb-4">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-[#1C274C] text-[24px] font-extrabold tracking-[-0.5px]">
                            Office Dashboard
                        </Text>
                        <TouchableOpacity activeOpacity={0.7} className="p-1">
                            <Ionicons name="grid" size={24} color="#1C274C" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[#6B7280] text-[15px] font-semibold">
                        Office Consultation Overview
                    </Text>
                </View>

                <View className="px-6 mt-2">
                    {/* Calendar */}
                    <CalendarWidget
                        events={appointments}
                    />

                    {/* Appointment Feed */}
                    <View className="mb-6 mt-4">
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-[#1C274C] text-[22px] font-bold tracking-tight">
                                Appointment Feed
                            </Text>
                        </View>

                        {filteredAppointments.map(apt => (
                            // @ts-ignore
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}

                        {filteredAppointments.length === 0 && (
                            <View className="bg-white rounded-xl p-8 items-center">
                                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 text-center mt-3 font-semibold">
                                    No appointments found
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="h-24" />
                </View>
            </ScrollView>
        </View>
    );
}
