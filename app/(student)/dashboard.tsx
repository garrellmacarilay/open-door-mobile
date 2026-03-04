import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';
import BookConsultationModal from '../../components/student/BookConsultationModal';
import BookingInfoModal from '../../components/student/BookingInfoModal';
import BookingSuccessModal from '../../components/student/BookingSuccessModal';

// Office list from contactInfo in Landingpage.jsx
const OFFICES = [
    { id: 'all', label: 'All Offices' },
    { id: '1', label: 'Prefect and Assistant Prefect' },
    { id: '2', label: 'Guidance' },
    { id: '3', label: 'Medical Clinic' },
    { id: '4', label: 'Sports Development and Management' },
    { id: '5', label: 'Student Assistance and Experiential Learning' },
    { id: '6', label: 'Student Discipline' },
    { id: '7', label: 'Student Internship' },
    { id: '8', label: 'IT Support Services' },
    { id: '9', label: 'Student Organizations' },
    { id: '10', label: 'Student Publications' },
];

const STATUSES = [
    { id: 'all', label: 'All Status' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'completed', label: 'Completed' },
    { id: 'declined', label: 'Declined' },
];

// Dummy Data
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

interface DropdownModalProps {
    visible: boolean;
    title: string;
    options: { id: string; label: string }[];
    selected: string;
    onSelect: (label: string) => void;
    onClose: () => void;
}

function DropdownModal({ visible, title, options, selected, onSelect, onClose }: DropdownModalProps) {
    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
            <TouchableOpacity
                className="flex-1 bg-black/40 justify-end"
                activeOpacity={1}
                onPress={onClose}
            >
                <View className="bg-white rounded-t-[28px] pb-8 pt-4">
                    {/* Handle bar */}
                    <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-4" />

                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 mb-4">
                        <Text className="text-[#1C274C] text-[18px] font-extrabold">{title}</Text>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
                            <Ionicons name="close" size={22} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Options */}
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.id}
                        style={{ maxHeight: 360 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const isSelected = item.label === selected;
                            return (
                                <TouchableOpacity
                                    className={`flex-row items-center justify-between mx-4 mb-2 px-4 py-3.5 rounded-[14px] ${isSelected ? 'bg-[#EFF6FF] border border-[#BFDBFE]' : 'bg-gray-50'}`}
                                    activeOpacity={0.7}
                                    onPress={() => { onSelect(item.label); onClose(); }}
                                >
                                    <Text
                                        className={`text-[14px] font-bold flex-1 mr-2 ${isSelected ? 'text-[#1D4ED8]' : 'text-[#374151]'}`}
                                        numberOfLines={2}
                                    >
                                        {item.label}
                                    </Text>
                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={20} color="#1D4ED8" />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

export default function StudentDashboard() {
    const [appointments, setAppointments] = useState(DUMMY_APPOINTMENTS);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState('All Offices');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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

    // Filter logic
    const filteredAppointments = appointments.filter(apt => {
        const officeMatch = selectedOffice === 'All Offices' || apt.details.office === selectedOffice;
        const statusMatch = selectedStatus === 'All Status' || apt.details.status.toLowerCase() === selectedStatus.toLowerCase();
        return officeMatch && statusMatch;
    });

    // Whether the current selected value is the default (for styling)
    const isDefaultOffice = selectedOffice === 'All Offices';
    const isDefaultStatus = selectedStatus === 'All Status';

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
                    {/* Office Dropdown */}
                    <TouchableOpacity
                        className={`flex-1 flex-row items-center justify-between bg-white border rounded-[12px] px-3.5 py-3 shadow-sm ${!isDefaultOffice ? 'border-[#1D4ED8]' : 'border-gray-200'}`}
                        activeOpacity={0.7}
                        onPress={() => setShowOfficeDropdown(true)}
                    >
                        <Text
                            className={`text-[12px] font-bold flex-1 mr-1 ${!isDefaultOffice ? 'text-[#1D4ED8]' : 'text-[#1C274C]'}`}
                            numberOfLines={1}
                        >
                            {selectedOffice}
                        </Text>
                        <View className="bg-gray-100 rounded-md p-0.5">
                            <Ionicons name="chevron-down" size={14} color={!isDefaultOffice ? '#1D4ED8' : '#6B7280'} />
                        </View>
                    </TouchableOpacity>

                    {/* Status Dropdown */}
                    <TouchableOpacity
                        className={`flex-1 flex-row items-center justify-between bg-white border rounded-[12px] px-3.5 py-3 shadow-sm ${!isDefaultStatus ? 'border-[#1D4ED8]' : 'border-gray-200'}`}
                        activeOpacity={0.7}
                        onPress={() => setShowStatusDropdown(true)}
                    >
                        <Text
                            className={`text-[13px] font-bold ${!isDefaultStatus ? 'text-[#1D4ED8]' : 'text-[#1C274C]'}`}
                            numberOfLines={1}
                        >
                            {selectedStatus}
                        </Text>
                        <View className="bg-gray-100 rounded-md p-0.5">
                            <Ionicons name="chevron-down" size={14} color={!isDefaultStatus ? '#1D4ED8' : '#6B7280'} />
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
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-[#1C274C] text-[22px] font-bold tracking-tight">
                                Appointment Feed
                            </Text>
                            {(!isDefaultOffice || !isDefaultStatus) && (
                                <TouchableOpacity
                                    onPress={() => { setSelectedOffice('All Offices'); setSelectedStatus('All Status'); }}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-[#1D4ED8] text-[13px] font-semibold">Clear filters</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {filteredAppointments.map(apt => (
                            // @ts-ignore
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}

                        {filteredAppointments.length === 0 && (
                            <View className="bg-white rounded-xl p-8 items-center">
                                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 text-center mt-3 font-semibold">No appointments match your filters</Text>
                            </View>
                        )}
                    </View>

                    {/* Padding for bottom nav */}
                    <View className="h-24" />
                </View>
            </ScrollView>

            {/* Office Dropdown Modal */}
            <DropdownModal
                visible={showOfficeDropdown}
                title="Select Office"
                options={OFFICES}
                selected={selectedOffice}
                onSelect={setSelectedOffice}
                onClose={() => setShowOfficeDropdown(false)}
            />

            {/* Status Dropdown Modal */}
            <DropdownModal
                visible={showStatusDropdown}
                title="Select Status"
                options={STATUSES}
                selected={selectedStatus}
                onSelect={setSelectedStatus}
                onClose={() => setShowStatusDropdown(false)}
            />

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
