import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, RefreshControl, Alert, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppointmentCard from '../../components/student/AppointmentCard';
import CalendarWidget from '../../components/student/CalendarWidget';
import DatePickerModal from '../../components/student/DatePickerModal';
import TimePickerModal from '../../components/student/TimePickerModal';
import { useOfficeUpcomingAppointments } from '@/hooks/staffHooks';
import { useEvents } from '@/hooks/staffAdminHooks';
import { useAuth } from '@/context/AuthContext';
import EventCard from '@/components/student/EventCard';
import LoadingBlock from '@/components/loading/LoadingBlock';


export default function OfficeDashboard() {

    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(now.getFullYear())
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const { appointments, loading, refresh } = useOfficeUpcomingAppointments(currentMonth, currentYear, selectedDay, undefined);

    const { setError, error, createEvent, events, refreshEvents, loading: eventLoading, isSubmitting } = useEvents(currentMonth, currentYear)

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [showTimePickerModal, setShowTimePickerModal] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const { user } = useAuth()

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent, (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        });

        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);


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

            Alert.alert('Success', 'Event uploaded successfully')
            // Reset Form
            setEventTitle('');
            setEventDate('');
            setEventTime('');
            setEventDescription('');
            setShowAddEventModal(false);


        } else {
            Alert.alert('Error', result?.message || 'Failed to create event');
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refresh} />
                }
            >

                {/* Title Section */}
                <View className="px-6 pt-5 pb-4">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-[#1C274C] text-[24px] font-extrabold tracking-[-0.5px]">
                            Office Dashboard
                        </Text>
                        {loading && <ActivityIndicator size="small" color="#1C274C" />}
                    </View>
                    <Text className="text-[#6B7280] text-[15px] font-semibold">
                        Office Consultation Overview
                    </Text>
                </View>

                <View className="px-6 mt-2">
                    {/* Calendar */}
                    <CalendarWidget
                        appointments={appointments}
                        events={events}
                        onMonthChange={(date) => {
                        const d = new Date(date);
                        setViewDate(d);

                        setCurrentMonth(d.getMonth() + 1);
                        setCurrentYear(d.getFullYear());
                        setSelectedDay(undefined)
                    }}
                    onDateSelect={(date) => {
                        const day = date.getDate();
                        setSelectedDay(prev => prev === day ? undefined : day);
                    }}
                    onAddEvent={() => setShowAddEventModal(true)}
                    userRole={user?.role}
                    />

                    {/* Appointment Feed */}
                    <View className="mb-6 mt-4">
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-[#1C274C] text-[18.5px] font-bold tracking-tight">
                                {selectedDay
                                    ? `${viewDate.toLocaleString('default', { month: 'long' })} ${selectedDay}`
                                    : 'Appointments and Events Feed'
                                }
                            </Text>
                            {selectedDay && (
                                <TouchableOpacity onPress={() => setSelectedDay(undefined)}>
                                <Text className="text-[#1D4ED8] text-[13px] font-semibold">Show all</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={events.length > 3}
                            style={{ maxHeight: 320 }}
                            nestedScrollEnabled
                        >
                            {events.map(apt => (
                                <EventCard key={apt.id} event={apt} />
                            ))}
                        </ScrollView>

                        <View className="flex-row items-center mb-6">
                            <View className="flex-1 h-[1px] bg-gray-200" />
                            <View className="flex-1 h-[1px] bg-gray-200" />
                        </View>

                        {loading && (
                            <View className="py-6">
                                <LoadingBlock height={100} />
                                <LoadingBlock height={100} />
                            </View>
                        )}

                        {/* Appointment List */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={appointments.length > 3}
                            style={{ maxHeight: 320 }}
                            nestedScrollEnabled
                        >
                            {appointments.map((apt: any, index: number) => (
                                <AppointmentCard key={`${apt.id}-${index}`} appointment={apt} />
                            ))}
                        </ScrollView>

                        {!loading && !eventLoading && appointments.length === 0 && events.length === 0 && (
                            <View className="bg-white rounded-xl p-8 items-center border border-gray-100">
                                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 text-center mt-3 font-semibold">
                                    {selectedDay
                                        ? `No appointments or events on ${viewDate.toLocaleString('default', { month: 'long' })} ${selectedDay}`
                                        : `No upcoming appointments and events found for ${viewDate.toLocaleString('default', { month: 'long' })}`
                                    }
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="h-24" />
                </View>
            </ScrollView>

            {/* Add Event Modal */}
            <Modal
                animationType="slide"
                transparent
                statusBarTranslucent
                navigationBarTranslucent
                visible={showAddEventModal}
                onRequestClose={() => setShowAddEventModal(false)}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 justify-end">
                    <KeyboardAvoidingView                         
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        className="absolute bottom-0 left-0 right-0"
                        style={{ marginBottom: Platform.OS === 'android' ? keyboardHeight : 0 }}
                    >
                        <View className="bg-white rounded-t-[28px] shadow-xl">
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}
                            >
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
                                        disabled={isSubmitting}
                                        className={`flex-1 rounded-[12px] py-3.5 items-center ${isSubmitting ? 'bg-[#1C274C]/60' : 'bg-[#1C274C]'}`}
                                        activeOpacity={0.8}
                                    >
                                    {isSubmitting ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <Text className="text-white font-bold text-[15px]">Create Event</Text>
                                    )}    
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
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
