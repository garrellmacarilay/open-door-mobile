import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';

const DUMMY_APPOINTMENTS = [
    {
        id: 1,
        title: 'Academic Advising Session',
        details: {
            student: 'John Doe',
            office: 'Guidance',
            status: 'pending',
            service_type: 'Academic Consultation',
        },
        dateString: 'December 15, 2025',
        time: '10:00 AM',
    },
    {
        id: 2,
        title: 'Career Planning Meeting',
        details: {
            student: 'Jane Smith',
            office: 'Student Internship',
            status: 'approved',
            service_type: 'Career Guidance',
        },
        dateString: 'December 16, 2025',
        time: '2:30 PM',
    },
];

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState(DUMMY_APPOINTMENTS);
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const handleAddEvent = () => {
        if (!eventTitle.trim() || !eventDate.trim()) {
            alert('Please fill in Event Title and Date');
            return;
        }

        const newEvent = {
            id: Math.random(),
            title: eventTitle,
            details: {
                student: 'Current Office',
                office: 'Current Office',
                status: 'pending',
                service_type: eventDescription || eventTitle,
            },
            dateString: eventDate,
            time: eventTime || 'TBD',
        };

        setAppointments([...appointments, newEvent]);
        setEventTitle('');
        setEventDate('');
        setEventTime('');
        setEventDescription('');
        setShowAddEventModal(false);
    };

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

                <View className="px-6 mt-2">
                    <CalendarWidget events={appointments} onAddEvent={() => setShowAddEventModal(true)} />

                    <View className="mb-6 mt-4">
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-[#1C274C] text-[22px] font-bold tracking-tight">
                                Appointment Feed
                            </Text>
                        </View>

                        {appointments.map((apt) => (
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}

                        {appointments.length === 0 && (
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

            <Modal
                animationType="slide"
                transparent
                visible={showAddEventModal}
                onRequestClose={() => setShowAddEventModal(false)}
            >
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-[28px] px-6 pt-5 pb-10 shadow-xl">
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
                                <TextInput
                                    value={eventDate}
                                    onChangeText={setEventDate}
                                    placeholder="mm/dd/yyyy"
                                    placeholderTextColor="#9CA3AF"
                                    className="border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-500 text-[13px] font-bold mb-2 ml-1">Time</Text>
                                <TextInput
                                    value={eventTime}
                                    onChangeText={setEventTime}
                                    placeholder="--:--"
                                    placeholderTextColor="#9CA3AF"
                                    className="border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                                />
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
        </View>
    );
}
