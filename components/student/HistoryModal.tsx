import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EvaluationModal from './EvaluationModal';

interface HistoryModalProps {
    visible: boolean;
    appointment: any;
    onClose: () => void;
}

export default function HistoryModal({ visible, appointment, onClose }: HistoryModalProps) {
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [showCancelReason, setShowCancelReason] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    if (!appointment) return null;

    const handleCloseCancelReason = () => {
        setShowCancelReason(false);
        setCancelReason('');
    };

    const handleSubmitCancellation = () => {
        if (!cancelReason.trim()) {
            return;
        }

        handleCloseCancelReason();
        onClose();
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return { bg: 'bg-[#FEF9C3] border-[#FEF08A]', text: 'text-[#A16207]' };
            case 'approved': return { bg: 'bg-[#DCFCE7] border-[#86EFAC]', text: 'text-[#16A34A]' };
            case 'completed': return { bg: 'bg-[#DBEAFE] border-[#93C5FD]', text: 'text-[#2563EB]' };
            case 'declined': return { bg: 'bg-[#FEE2E2] border-[#FECACA]', text: 'text-[#DC2626]' };
            default: return { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600' };
        }
    };

    const statusStyle = getStatusStyle(appointment.status);
    const isCompleted = appointment.status.toLowerCase() === 'completed';
    const isApproved = appointment.status.toLowerCase() === 'approved';
    const isDeclined = appointment.status.toLowerCase() === 'declined';

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent
                navigationBarTranslucent
                visible={visible}
                onRequestClose={onClose}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 justify-end bg-black/40">
                    <View className="bg-white rounded-t-[32px] p-6 h-[88%] shadow-lg">
                        {/* Header: Status and Close */}
                        <View className="flex-row items-center justify-between mb-8 mt-2">
                            <View className="flex-row items-center gap-3">
                                <View className={`px-4 py-1.5 rounded-full border ${statusStyle.bg}`}>
                                    <Text className={`text-[12px] font-bold capitalize ${statusStyle.text}`}>
                                        {appointment.status}
                                    </Text>
                                </View>
                                <Text className="text-gray-400 text-[13px] font-bold tracking-wider">
                                    {appointment.id}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.6}>
                                <Ionicons name="close" size={26} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                            {/* Office Category */}
                            <Text className="text-gray-400 text-[23px] font-bold mb-1">Office Category</Text>
                            <Text className="text-[#111827] text-[40px] font-extrabold mb-8 tracking-tight">
                                {appointment.title}
                            </Text>

                            {/* Date and Time Cards */}
                            <View className="flex-row gap-4 mb-8">
                                <View className="flex-1 bg-[#F9FAFB] rounded-[14px] p-4 border border-gray-100">
                                    <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Date</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
                                        <Text className="text-gray-500 font-bold text-[12px]">{appointment.date}</Text>
                                    </View>
                                </View>
                                <View className="flex-1 bg-[#F9FAFB] rounded-[14px] p-4 border border-gray-100">
                                    <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Date</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                        <Text className="text-gray-500 font-bold text-[12px]">{appointment.time}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Topic */}
                            <Text className="text-gray-500 text-[30px] font-bold mb-2">Topic</Text>
                            <View className="bg-white border border-gray-200 rounded-[12px] px-4 py-3 mb-6">
                                <Text className="text-gray-400 font-semibold text-[16px]">
                                    {appointment.topic || 'School Athletes Check Up'}
                                </Text>
                            </View>

                            {/* Members and Files */}
                            <View className="flex-row mb-10">
                                <View className="flex-1 justify-center">
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <Ionicons name="people-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-bold text-[14px]">Members</Text>
                                    </View>
                                    <Text className="text-gray-300 font-bold text-[13px]">
                                        {appointment.group_members || 'Individual'}
                                    </Text>
                                </View>
                                <View className="flex-1 justify-center items-start">
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <Ionicons name="attach-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-bold text-[14px]">Files</Text>
                                    </View>
                                    <Text className="text-gray-300 font-bold text-[13px]">----</Text>
                                </View>
                            </View>

                            {/* Footer Actions */}
                            {isCompleted ? (
                                <View>
                                    <View className="bg-[#DBEAFE] rounded-[18px] px-4 py-5 flex-row items-center justify-center gap-1 mb-4 border border-[#93C5FD]">
                                        <Ionicons name="information-circle-outline" size={16} color="#1E3A8A" />
                                        <Text className="text-[#1E3A8A] font-bold text-[12px] text-center">
                                            Feedback is required for completed services.
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-[#0066FF] rounded-full py-4 flex-row items-center justify-center gap-2"
                                        activeOpacity={0.8}
                                        onPress={() => setShowEvaluation(true)}
                                    >
                                        <Ionicons name="chatbox-ellipses-outline" size={18} color="white" />
                                        <Text className="text-white font-bold text-[16px]">Leave Feedback</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    <View className="bg-[#F3F4F6] rounded-full py-3.5 flex-row items-center justify-center border border-gray-200">
                                        <Text className="text-[#D1D5DB] font-bold text-[13px]">Feedback Available Upon Completion</Text>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-[#FEE2E2] rounded-full py-3.5 flex-row items-center justify-center border border-[#FCA5A5]"
                                        activeOpacity={0.7}
                                        onPress={() => setShowCancelReason(true)}
                                    >
                                        <Text className="text-[#FB7185] font-bold text-[15px]">Cancel Consultation</Text>
                                    </TouchableOpacity>
                                    {(isApproved || isDeclined) && (
                                        <TouchableOpacity
                                            className="bg-[#16264D] rounded-full py-3.5 flex-row items-center justify-center gap-2"
                                            activeOpacity={0.8}
                                        >
                                            <Ionicons name="refresh" size={16} color="white" />
                                            <Text className="text-white font-bold text-[16px]">Reschedule</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Evaluation Modal - opens on top */}
            <EvaluationModal
                visible={showEvaluation}
                appointmentTitle={appointment?.title}
                onClose={() => setShowEvaluation(false)}
            />

            <Modal
                animationType="fade"
                transparent={true}
                statusBarTranslucent
                navigationBarTranslucent
                visible={showCancelReason}
                onRequestClose={handleCloseCancelReason}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/45 justify-center items-center px-6">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        className="w-full max-w-md"
                    >
                        <View className="bg-white rounded-[24px] px-6 pt-7 pb-6 shadow-xl">
                            <Text className="text-[#2F3136] text-[28px] font-extrabold mb-6">
                                Reason for Cancellation
                            </Text>

                            <Text className="text-[#3F3F46] text-[15px] font-medium mb-5 leading-6">
                                Please provide a reason for cancelling this request.
                            </Text>

                            <TextInput
                                className="w-full border border-[#D4D4D8] rounded-[16px] px-4 py-4 text-[#18181B] text-[15px] bg-white"
                                placeholder="Provide a reason for cancelling this request..."
                                placeholderTextColor="#A1A1AA"
                                multiline
                                numberOfLines={6}
                                style={{ height: 180, textAlignVertical: 'top' }}
                                value={cancelReason}
                                onChangeText={setCancelReason}
                            />

                            <TouchableOpacity
                                className={`rounded-[14px] py-4 items-center justify-center mt-6 ${cancelReason.trim() ? 'bg-[#FF473A]' : 'bg-[#FCA5A5]'}`}
                                activeOpacity={0.8}
                                onPress={handleSubmitCancellation}
                                disabled={!cancelReason.trim()}
                            >
                                <Text className="text-white text-[18px] font-bold">Cancel Request</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="items-center justify-center mt-4"
                                activeOpacity={0.7}
                                onPress={handleCloseCancelReason}
                            >
                                <Text className="text-[#6B7280] text-[15px] font-semibold">Back</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </>
    );
}
