import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';
import BookConsultationModal from '../../components/student/BookConsultationModal';
import BookingInfoModal from '../../components/student/BookingInfoModal';
import BookingSuccessModal from '../../components/student/BookingSuccessModal';
// 🚀 Using your updated hooks
import { useUpcomingAppointments, useOffices } from '@/hooks/globalHooks';
import { useBookings } from '@/hooks/studentHooks';

const STATUSES = [
    { id: 'all', label: 'All Status' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'completed', label: 'Completed' },
    { id: 'declined', label: 'Declined' },
];

interface DropdownModalProps {
    visible: boolean;
    title: string;
    options: { id: string; label: string }[];
    selectedId: string;
    onSelect: (label: string) => void;
    onClose: () => void;
}

function DropdownModal({ visible, title, options, selectedId, onSelect, onClose }: DropdownModalProps) {
    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
            <TouchableOpacity
                className="flex-1 bg-black/40 justify-end"
                activeOpacity={1}
                onPress={onClose}
            >
                <View className="bg-white rounded-t-[28px] pb-8 pt-4">
                    <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-4" />
                    <View className="flex-row items-center justify-between px-6 mb-4">
                        <Text className="text-[#1C274C] text-[18px] font-extrabold">{title}</Text>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
                            <Ionicons name="close" size={22} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.id}
                        style={{ maxHeight: 360 }}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const isSelected = item.id === selectedId;
                            return (
                                <TouchableOpacity
                                    className={`flex-row items-center justify-between mx-4 mb-2 px-4 py-3.5 rounded-[14px] ${isSelected ? 'bg-[#EFF6FF] border border-[#BFDBFE]' : 'bg-gray-50'}`}
                                    activeOpacity={0.7}
                                    onPress={() => { onSelect(item.id); onClose(); }}
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
    // 1. Filter and Modal States
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState('All Offices');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date())

    // 2.  Hook Integration
    const offices = useOffices(); 

    const { appointments, loading, refresh } = useUpcomingAppointments(
        selectedOffice, selectedStatus,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
    );

    const currentStatusLabel = STATUSES.find(s => s.id === selectedStatus)?.label || 'All Status';
    
    const { handleSubmit, loading: isSubmitting, offices: office } = useBookings(() => {
        setShowBookingModal(false);
        setShowSuccessModal(true);
        refresh(); 
    });

    // Transform string array from hook to object array for DropdownModal
    const dynamicOfficeOptions = offices.map((name) => ({
        id: name,
        label: name
    }));

    const handleFabPress = () => {
        setShowInfoModal(true);
    };

    const handleInfoContinue = () => {
        setShowInfoModal(false);
        setShowBookingModal(true);
    };

    const handleBookConsultation = async (modalFormData: any) => {
        //Pass data from the modal state directly to the hook's submit
        await handleSubmit(modalFormData);
    };

    const getStatusLabel = (id: string) => {
        const found = STATUSES.find(s => s.id === id);
        return found ? found.label : 'All Status';
    };

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
                    <TouchableOpacity
                        className={`flex-1 flex-row items-center justify-between bg-white border rounded-[12px] px-3.5 py-3 shadow-sm ${!isDefaultOffice ? 'border-[#1D4ED8]' : 'border-gray-200'}`}
                        activeOpacity={0.7}
                        onPress={() => setShowOfficeDropdown(true)}
                    >
                        <Text className={`text-[12px] font-bold flex-1 mr-1 ${!isDefaultOffice ? 'text-[#1D4ED8]' : 'text-[#1C274C]'}`} numberOfLines={1}>
                            {selectedOffice}
                        </Text>
                        <View className="bg-gray-100 rounded-md p-0.5">
                            <Ionicons name="chevron-down" size={14} color={!isDefaultOffice ? '#1D4ED8' : '#6B7280'} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 flex-row items-center justify-between bg-white border rounded-[12px] px-3.5 py-3 shadow-sm ${selectedStatus !== 'all' ? 'border-[#1D4ED8]' : 'border-gray-200'}`}
                        activeOpacity={0.7}
                        onPress={() => setShowStatusDropdown(true)}
                    >
                        <Text className={`text-[13px] font-bold ${selectedStatus !== 'all' ? 'text-[#1D4ED8]' : 'text-[#1C274C]'}`} numberOfLines={1}>
                            {currentStatusLabel}
                        </Text>
                        <View className="bg-gray-100 rounded-md p-0.5">
                            <Ionicons name="chevron-down" size={14} color={selectedStatus !== 'all' ? '#1D4ED8' : '#6B7280'} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View className="px-6 mt-2">
                    {/* Calendar Section */}
                    <CalendarWidget
                        events={appointments}
                        onMonthChange={(date) => setCurrentDate(date)}
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
                                    onPress={() => { setSelectedOffice('All Offices'); setSelectedStatus('all'); }}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-[#1D4ED8] text-[13px] font-semibold">Clear filters</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Loading indicator for dynamic fetch */}
                        {loading && appointments.length === 0 ? (
                            <ActivityIndicator size="large" color="#1D4ED8" className="mt-10" />
                        ) : (
                            appointments.map((apt: any) => (
                                <AppointmentCard key={apt.id} appointment={apt} />
                            ))
                        )}

                        {!loading && appointments.length === 0 && (
                            <View className="bg-white rounded-xl p-8 items-center">
                                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 text-center mt-3 font-semibold">No appointments found</Text>
                            </View>
                        )}
                    </View>
                    <View className="h-24" />
                </View>
            </ScrollView>

            <DropdownModal
                visible={showOfficeDropdown}
                title="Select Office"
                options={dynamicOfficeOptions}
                selectedId={selectedOffice}
                onSelect={(id) => setSelectedOffice(id)}
                onClose={() => setShowOfficeDropdown(false)}
            />

            <DropdownModal
                visible={showStatusDropdown}
                title="Select Status"
                options={STATUSES}
                selectedId={selectedStatus}
                onSelect={(id) => setSelectedStatus(id)}
                onClose={() => setShowStatusDropdown(false)}
            />

            <BookingInfoModal
                visible={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                onContinue={handleInfoContinue}
            />

            <BookConsultationModal
                visible={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onSubmit={handleSubmit}
                offices={office}
                isSubmitting={isSubmitting}
            />

            <BookingSuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            <TouchableOpacity
                onPress={handleFabPress}
                activeOpacity={0.8}
                className="absolute right-7 bottom-[120px] w-[56px] h-[56px] bg-[#18233D] rounded-full items-center justify-center border-[2.5px] border-white z-50 shadow-lg"
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}