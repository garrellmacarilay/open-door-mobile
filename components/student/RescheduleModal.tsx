import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';
import BookingSuccessModal from './BookingSuccessModal';
import { useReschedule } from '@/hooks/studentHooks';

interface RescheduleModalProps {
    visible: boolean;
    appointment: any;
    onClose: () => void;
    onRefresh: () => void;
}

export default function RescheduleModal({ visible, appointment, onClose, onRefresh }: RescheduleModalProps) {
    const { rescheduleBooking, loading } = useReschedule(() => {});
    
    // States
    const [selectedDate, setSelectedDate] = useState(''); 
    const [selectedTime, setSelectedTime] = useState('8:00 AM');
    const [rescheduleReason, setRescheduleReason] = useState('');
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Step 1: Open Reason Modal after choosing Date/Time
    const handleInitiateReschedule = () => {
        if (!selectedDate) {
            return Alert.alert("Required", "Please select a date first.");
        }
        setShowReasonModal(true);
    };

    // Step 2: Final API Call
    const handleFinalConfirm = async () => {
        if (!rescheduleReason.trim()) {
            return Alert.alert("Required", "Please provide a reason for rescheduling.");
        }
        
        const success = await rescheduleBooking(
            appointment.id, 
            selectedDate, 
            selectedTime,
            rescheduleReason
        );

        if (success) {
            setShowReasonModal(false);
            setShowSuccess(true);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        setRescheduleReason(''); 
        onRefresh();
        onClose();
    };

    return (
        <>
            {/* MAIN SELECTION MODAL */}
            <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-[32px] p-6 pb-10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-[#1C274C] text-[20px] font-extrabold">Reschedule</Text>
                            <TouchableOpacity onPress={onClose} className="p-1">
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Date Selector */}
                        <Text className="text-gray-400 text-[12px] font-bold uppercase mb-2">New Date</Text>
                        <TouchableOpacity 
                            onPress={() => setShowDatePicker(true)}
                            className="flex-row items-center bg-gray-50 border border-gray-100 p-4 rounded-xl mb-4"
                        >
                            <Ionicons name="calendar-outline" size={20} color="#7C3AED" />
                            <Text className={`ml-3 flex-1 font-semibold ${selectedDate ? 'text-[#1C274C]' : 'text-gray-400'}`}>
                                {selectedDate || 'Select Date'}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* Time Selector */}
                        <Text className="text-gray-400 text-[12px] font-bold uppercase mb-2">New Time</Text>
                        <TouchableOpacity 
                            onPress={() => setShowTimePicker(true)}
                            className="flex-row items-center bg-gray-50 border border-gray-100 p-4 rounded-xl mb-8"
                        >
                            <Ionicons name="time-outline" size={20} color="#1D4ED8" />
                            <Text className="ml-3 flex-1 font-semibold text-[#1C274C]">
                                {selectedTime}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleInitiateReschedule}
                            className="w-full h-[54px] rounded-xl bg-[#18233D] items-center justify-center"
                        >
                            <Text className="text-white font-bold text-[16px]">Update Appointment</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* REASON MODAL */}
            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent
                visible={showReasonModal}
                onRequestClose={() => setShowReasonModal(false)}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/45 justify-center items-center px-6">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        className="w-full max-w-md"
                    >
                        <View className="bg-white rounded-[24px] px-6 pt-7 pb-6 shadow-xl">
                            <Text className="text-[#2F3136] text-[28px] font-extrabold mb-6">
                                Reason for Reschedule
                            </Text>

                            <Text className="text-[#3F3F46] text-[15px] font-medium mb-5 leading-6">
                                Please provide a reason for changing your appointment date.
                            </Text>

                            <TextInput
                                className="w-full border border-[#D4D4D8] rounded-[16px] px-4 py-4 text-[#18181B] text-[15px] bg-white"
                                placeholder="Type your reason here..."
                                placeholderTextColor="#A1A1AA"
                                multiline
                                numberOfLines={6}
                                style={{ height: 150, textAlignVertical: 'top' }}
                                value={rescheduleReason}
                                onChangeText={setRescheduleReason}
                            />

                            <TouchableOpacity
                                className={`rounded-[14px] py-4 items-center justify-center mt-6 ${rescheduleReason.trim() && !loading ? 'bg-[#18233D]' : 'bg-gray-300'}`}
                                activeOpacity={0.8}
                                onPress={handleFinalConfirm}
                                disabled={!rescheduleReason.trim() || loading}
                            >
                                <Text className="text-white text-[18px] font-bold">
                                    {loading ? "Processing..." : "Confirm Reschedule"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="items-center justify-center mt-4"
                                activeOpacity={0.7}
                                onPress={() => setShowReasonModal(false)}
                                disabled={loading}
                            >
                                <Text className="text-[#6B7280] text-[15px] font-semibold">Back</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Sub-Modals */}
            <DatePickerModal 
                visible={showDatePicker}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                onClose={() => setShowDatePicker(false)}
                minDaysFromNow={2}
            />
            <TimePickerModal 
                visible={showTimePicker}
                selectedTime={selectedTime}
                onSelect={setSelectedTime}
                onClose={() => setShowTimePicker(false)}
            />
            <BookingSuccessModal 
                visible={showSuccess}
                onClose={handleSuccessClose}
            />
        </>
    );
}