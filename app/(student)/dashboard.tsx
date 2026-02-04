import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import DashboardHeader from '../../components/student/DashboardHeader';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';
import { StatusBar } from 'expo-status-bar';

// Dummy Data
const DUMMY_APPOINTMENTS = [
    {
        id: 1,
        title: "Academic Advising Session",
        details: {
            student: "John Doe",
            office: "Guidance and Counseling",
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
            office: "Student Affairs",
            status: "approved",
            service_type: "Career Guidance"
        },
        dateString: "December 16, 2025",
        time: "2:30 PM"
    }
];

export default function StudentDashboard() {
    const [appointments, setAppointments] = useState(DUMMY_APPOINTMENTS);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

            {/* Header */}
            <DashboardHeader
                user={{ name: "Garrell Macarilay", email: "student@example.com" }}
            />

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>

                {/* Calendar Section */}
                <View className="mb-2">
                    <CalendarWidget />
                </View>

                {/* Upcoming Appointments Section */}
                <View className="mb-6">
                    <View className="bg-[#142240] rounded-t-lg py-3 px-4 mb-0 shadow-sm flex-row items-center">
                        <Text className="text-white font-bold text-base" style={{ fontFamily: 'Inter-Bold' }}>
                            Upcoming Appointments
                        </Text>
                    </View>

                    <View className="bg-white p-3 rounded-b-lg shadow-sm min-h-[100px]">
                        {appointments.map(apt => (
                            // @ts-ignore
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}

                        {appointments.length === 0 && (
                            <Text className="text-gray-500 text-center py-4">No upcoming appointments</Text>
                        )}
                    </View>
                </View>

                {/* Padding for bottom nav */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
