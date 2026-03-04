import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';
import BookConsultationModal from '../../components/student/BookConsultationModal';
import BookingInfoModal from '../../components/student/BookingInfoModal';
import BookingSuccessModal from '../../components/student/BookingSuccessModal';

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
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState('All Offices');
    const [selectedStatus, setSelectedStatus] = useState('All Status');

    // Step 1: FAB pressed → show info modal
    const handleFabPress = () => {
        setShowInfoModal(true);
    };

    // Step 2: Info modal "Continue" → show booking form
    const handleInfoContinue = () => {
        setShowInfoModal(false);
        setShowBookingModal(true);
    };

    // Step 3: Booking form submitted → show success
    const handleBookConsultation = (formData: any) => {
        const newAppointment = {
            id: Math.random(),
            title: `${formData.topic || 'New'} Session`,
            details: {
                student: "Current User",
                office: formData.office || "Selected Office",
                status: "pending",
                service_type: formData.topic
            },
            dateString: formData.date,
            time: formData.time
        };
        // @ts-ignore
        setAppointments([...appointments, newAppointment]);
        setShowBookingModal(false);
        setShowSuccessModal(true);
    };

    return (
        <View className="flex-1 bg-gray-50">

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
                    <TouchableOpacity className="flex-1 flex-row items-center justify-between bg-white border border-gray-200 rounded-[12px] px-3.5 py-3 shadow-sm" activeOpacity={0.7}>
                        <Text className="text-[#1C274C] text-[13px] font-bold">
                            {selectedOffice}
                        </Text>
                        <View className="bg-gray-100 rounded-md p-0.5">
                            <Ionicons name="chevron-down" size={14} color="#6B7280" />
                        </View>
                    </TouchableOpacity>

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
                        onBookPress={handleFabPress}
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
                    <View className="h-24" />
                </View>
            </ScrollView>

            {/* Step 1: Pre-info modal */}
            <BookingInfoModal
                visible={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                onContinue={handleInfoContinue}
            />

            {/* Step 2: Booking form modal */}
            <BookConsultationModal
                visible={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onSubmit={handleBookConsultation}
            />

            {/* Step 3: Success modal */}
            <BookingSuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                onPress={handleFabPress}
                activeOpacity={0.8}
                className="absolute right-7 bottom-[120px] w-[56px] h-[56px] bg-[#18233D] rounded-full items-center justify-center border-[2.5px] border-white z-50"
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

