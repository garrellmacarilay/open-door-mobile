import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DashboardHeader from '../../components/student/DashboardHeader';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';
import BookConsultationModal from '../../components/student/BookConsultationModal';
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
    const [isBookingModalVisible, setBookingModalVisible] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState('All Offices');
    const [selectedStatus, setSelectedStatus] = useState('All Status');

    const handleBookConsultation = (formData: any) => {
        console.log('Booking submitted:', formData);
        // Add to appointments dummy data for now
        const newAppointment = {
            id: Math.random(),
            title: `${formData.service_type} Session`,
            details: {
                student: "Current User",
                office: "Selected Office", // Map ID to name if real app
                status: "pending",
                service_type: formData.service_type
            },
            dateString: new Date(formData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: formData.time
        };
        // @ts-ignore
        setAppointments([...appointments, newAppointment]);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="light" />

            {/* Header */}
            <DashboardHeader
                user={{ name: "Garrell Macarilay", email: "student@example.com" }}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View className="bg-white px-5 pt-4 pb-3 border-b border-gray-100">
                    <Text className="text-[#1C2A48] text-xl font-bold mb-1" style={{ fontFamily: 'Poppins-Bold' }}>
                        Student Dashboard
                    </Text>
                    <Text className="text-gray-500 text-xs" style={{ fontFamily: 'Inter-Regular' }}>
                        Student Consultation Overview
                    </Text>
                </View>

                {/* Filter Section */}
                <View className="bg-white px-5 py-3 flex-row gap-3 border-b border-gray-100">
                    {/* All Offices Dropdown */}
                    <TouchableOpacity className="flex-1 flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                        <Text className="text-gray-700 text-xs" style={{ fontFamily: 'Inter-Medium' }}>
                            {selectedOffice}
                        </Text>
                        <Ionicons name="chevron-down" size={14} color="#6B7280" />
                    </TouchableOpacity>

                    {/* All Status Dropdown */}
                    <TouchableOpacity className="flex-1 flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                        <Text className="text-gray-700 text-xs" style={{ fontFamily: 'Inter-Medium' }}>
                            {selectedStatus}
                        </Text>
                        <Ionicons name="chevron-down" size={14} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <View className="px-5 pt-4">
                    {/* Calendar Section */}
                    <CalendarWidget
                        events={appointments}
                        onBookPress={() => setBookingModalVisible(true)}
                    />

                    {/* Appointment Feed Section */}
                    <View className="mb-6">
                        <Text className="text-[#1C2A48] text-base font-bold mb-4" style={{ fontFamily: 'Poppins-Bold' }}>
                            Appointment Feed
                        </Text>

                        {appointments.map(apt => (
                            // @ts-ignore
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}

                        {appointments.length === 0 && (
                            <View className="bg-white rounded-xl p-8 items-center">
                                <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 text-center mt-3">No appointments scheduled</Text>
                            </View>
                        )}
                    </View>

                    {/* Padding for bottom nav */}
                    <View className="h-20" />
                </View>
            </ScrollView>

            <BookConsultationModal
                visible={isBookingModalVisible}
                onClose={() => setBookingModalVisible(false)}
                onSubmit={handleBookConsultation}
            />
        </SafeAreaView>
    );
}
