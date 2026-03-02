import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        <View className="flex-1 bg-gray-50">
            <StatusBar style="light" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Title Section */}
                <View className="px-6 pt-5 pb-4">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-[#1C274C] text-[24px] font-extrabold tracking-[-0.5px]">
                            Student Dashboard
                        </Text>
                        <TouchableOpacity activeOpacity={0.7} className="p-1">
                            <Ionicons name="grid" size={24} color="#1C274C" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-[#6B7280] text-[15px] font-semibold">
                        Student Consultation Overview
                    </Text>
                </View>

                {/* Filter Section */}
                <View className="px-6 flex-row gap-4 mb-6">
                    {/* All Offices Dropdown */}
                    <TouchableOpacity className="flex-1 flex-row items-center justify-between bg-white border border-gray-200 rounded-[12px] px-3.5 py-3 shadow-sm" activeOpacity={0.7}>
                        <Text className="text-[#1C274C] text-[13px] font-bold">
                            {selectedOffice}
                        </Text>
                        <View className="bg-gray-100 rounded-md p-0.5">
                            <Ionicons name="chevron-down" size={14} color="#6B7280" />
                        </View>
                    </TouchableOpacity>

                    {/* All Status Dropdown */}
                    <TouchableOpacity className="flex-1 flex-row items-center justify-between bg-white border border-gray-200 rounded-[12px] px-3.5 py-3 shadow-sm" activeOpacity={0.7}>
                        <Text className="text-[#1C274C] text-[13px] font-bold">
                            {selectedStatus}
                        </Text>
                        <View className="bg-gray-100 rounded-md p-0.5">
                            <Ionicons name="chevron-down" size={14} color="#6B7280" />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="px-6 mt-2">
                    {/* Calendar Section */}
                    <CalendarWidget
                        events={appointments}
                        onBookPress={() => setBookingModalVisible(true)}
                    />

                    {/* Appointment Feed Section */}
                    <View className="mb-6 mt-4">
                        <Text className="text-[#1C274C] text-[22px] font-bold tracking-tight mb-5">
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

            {/* Floating Action Button for Booking */}
            <TouchableOpacity
                onPress={() => setBookingModalVisible(true)}
                activeOpacity={0.8}
                className="absolute right-6 bottom-28 w-[56px] h-[56px] bg-[#18233D] rounded-full items-center justify-center border-[2.5px] border-white z-50"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 6,
                }}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}
