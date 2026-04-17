import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
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
    const { rescheduleBooking, loading } = useReschedule();
    
    // States for internal flow
    const [selectedDate, setSelectedDate] = useState(''); // 'mm/dd/yyyy'
    const [selectedTime, setSelectedTime] = useState('8:00 AM');
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleConfirm = async () => {
        if (!selectedDate) {
            return Alert.alert("Required", "Please select a date first.");
        }
        
        const success = await rescheduleBooking(appointment.id, selectedDate, selectedTime);
        if (success) {
            setShowSuccess(true);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        onRefresh();
        onClose();
    };

    return (
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

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleConfirm}
                        disabled={loading}
                        className={`w-full h-[54px] rounded-xl items-center justify-center ${loading ? 'bg-gray-300' : 'bg-[#18233D]'}`}
                    >
                        <Text className="text-white font-bold text-[16px]">
                            {loading ? "Updating..." : "Update Appointment"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

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
        </Modal>
    );
}