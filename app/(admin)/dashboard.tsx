import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';
import DatePickerModal from '../../components/student/DatePickerModal';
import TimePickerModal from '../../components/student/TimePickerModal';

import { useUpcomingAppointments, useOffices } from '@/hooks/globalHooks';
import { useAuth } from '@/context/AuthContext'
import { useEvents } from '@/hooks/staffAdminHooks';

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


export default function AdminDashboard() {
    //UI & Filter States
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [showTimePickerModal, setShowTimePickerModal] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const [selectedOffice, setSelectedOffice] = useState('All Offices');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showOfficeDropdown, setShowOfficeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const [viewDate, setViewDate] = useState(new Date());
    const { setError, error, createEvent, events, refreshEvents} = useEvents()

    const { user } = useAuth()

    const offices = useOffices(); 
    const {
        appointments, 
        loading, 
        refresh, 
        hasMore, 
        loadMore 
    } = useUpcomingAppointments(
        selectedOffice, selectedStatus,
        viewDate.getMonth() + 1,
        viewDate.getFullYear()
    );

    const handleAddEvent = async () => {
        if (!eventTitle.trim() || !eventDate.trim() || !eventTime.trim()) {
            alert('Please fill in Event Title, Date, and Time');
            return;
        }

        const payload = {
            event_title: eventTitle,
            description: eventDescription || eventTitle,
            event_date: eventDate, // Format should be YYYY-MM-DD from DatePicker
            event_time: eventTime, // Format should be HH:mm from TimePicker
        };

        const result = await createEvent(payload);

        if (result?.success) {
            // Reset Form
            setEventTitle('');
            setEventDate('');
            setEventTime('');
            setEventDescription('');
            setShowAddEventModal(false);
        } else {
            alert(error || 'Failed to create event');
        }
    };

    //Filter helpers    
    const isDefaultOffice = selectedOffice === 'All Offices';
    const currentStatusLabel = STATUSES.find(s => s.id === selectedStatus)?.label || 'All Status';

    const dynamicOfficeOptions = offices.map((name) => ({
        id: name,
        label: name
    }));

    //Scroll Logic for Pagination
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        // Trigger loadMore when 100px from the bottom
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

        if (isCloseToBottom && hasMore && !loading) {
            loadMore();
        }
    };

    if (!user) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#1D4ED8" />
            </View>
        )
    }
    

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 pt-5 pb-4">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-[#1C274C] text-[24px] font-extrabold tracking-[-0.5px]">
                            Admin Dashboard
                        </Text>
                    </View>
                    <Text className="text-[#6B7280] text-[15px] font-semibold">
                        Administrative Consultation Overview
                    </Text>
                </View>

                <View className="px-6 flex-row gap-4 mb-6">
                    <TouchableOpacity
                        className={`flex-1 flex-row items-center justify-between bg-white border rounded-[12px] px-3.5 py-3 shadow-sm ${!isDefaultOffice ? 'border-[#1D4ED8]' : 'border-gray-200'}`}
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
                    <CalendarWidget 
                        events={appointments} 
                        onMonthChange={(date) => setViewDate(new Date(date))}
                        
                        onAddEvent={() => setShowAddEventModal(true)} 
                        userRole={user?.role} 
                    />

                    {/* Appointment Feed */}
                    <View className="mb-6 mt-4">
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-[#1C274C] text-[22px] font-bold tracking-tight">
                                Appointments and Events Feed
                            </Text>
                            {(!isDefaultOffice || selectedStatus !== 'all') && (
                                <TouchableOpacity 
                                    onPress={() => { setSelectedOffice('All Offices'); setSelectedStatus('all'); }}
                                >
                                    <Text className="text-[#1D4ED8] text-[13px] font-semibold">Clear filters</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Appointment List */}
                        {appointments.map((apt: any, index: number) => (
                            <AppointmentCard key={`${apt.id}-${index}`} appointment={apt} />
                        ))}

                        {/* Loading States */}
                        {loading && (
                            <View className="py-6">
                                <ActivityIndicator size="small" color="#1D4ED8" />
                            </View>
                        )}

                        {!loading && appointments.length === 0 && (
                            <View className="bg-white rounded-xl p-8 items-center border border-gray-100">
                                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 text-center mt-3 font-semibold">
                                    No upcoming appointments found for {viewDate.toLocaleString('default', { month: 'long' })}
                                </Text>
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

            <Modal
                animationType="slide"
                transparent
                statusBarTranslucent
                navigationBarTranslucent
                visible={showAddEventModal}
                onRequestClose={() => setShowAddEventModal(false)}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-[28px] px-6 pt-5 pb-4 shadow-xl">
                        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-5" />
                        <Text className="text-[#1C274C] text-[22px] font-extrabold mb-6">Add Event</Text>

                        <View className="mb-5">
                            <Text className="text-gray-500 text-[13px] font-bold mb-2 ml-1">Event Title</Text>
                            <TextInput
                                value={eventTitle}
                                onChangeText={setEventTitle}
                                placeholder="Internship Preparation"
                                placeholderTextColor="#9CA3AF"
                                className="w-full border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                            />
                        </View>

                        <View className="flex-row gap-3 mb-5">
                            <View className="flex-1">
                                <Text className="text-gray-500 text-[13px] font-bold mb-2 ml-1">Date</Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePickerModal(true)}
                                    activeOpacity={0.75}
                                    className="border border-gray-300 rounded-[12px] px-4 py-3.5 flex-row items-center justify-between"
                                >
                                    <Text className={`text-[15px] ${eventDate ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {eventDate || 'mm/dd/yyyy'}
                                    </Text>
                                    <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-500 text-[13px] font-bold mb-2 ml-1">Time</Text>
                                <TouchableOpacity
                                    onPress={() => setShowTimePickerModal(true)}
                                    activeOpacity={0.75}
                                    className="border border-gray-300 rounded-[12px] px-4 py-3.5 flex-row items-center justify-between"
                                >
                                    <Text className={`text-[15px] ${eventTime ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {eventTime || '--:--'}
                                    </Text>
                                    <Ionicons name="time-outline" size={18} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-gray-500 text-[13px] font-bold mb-2 ml-1">Description</Text>
                            <TextInput
                                value={eventDescription}
                                onChangeText={setEventDescription}
                                placeholder="Event details..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                className="border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                            />
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowAddEventModal(false)}
                                className="flex-1 border border-gray-300 rounded-[12px] py-3.5 items-center"
                                activeOpacity={0.7}
                            >
                                <Text className="text-gray-600 font-bold text-[15px]">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleAddEvent}
                                className="flex-1 bg-[#1C274C] rounded-[12px] py-3.5 items-center"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-bold text-[15px]">Create Event</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <DatePickerModal
                visible={showDatePickerModal}
                selectedDate={eventDate}
                onSelect={setEventDate}
                onClose={() => setShowDatePickerModal(false)}
                minDaysFromNow={0}
            />

            <TimePickerModal
                visible={showTimePickerModal}
                selectedTime={eventTime}
                onSelect={setEventTime}
                onClose={() => setShowTimePickerModal(false)}
            />
        </View>
    );
}
