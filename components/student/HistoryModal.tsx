import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EvaluationModal from './EvaluationModal';

interface HistoryModalProps {
    visible: boolean;
    appointment: any;
    onClose: () => void;
}

export default function HistoryModal({ visible, appointment, onClose }: HistoryModalProps) {
    const [showEvaluation, setShowEvaluation] = useState(false);

    if (!appointment) return null;

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
                                <View className="gap-4">
                                    <View className="bg-[#F9FAFB] rounded-full py-4 flex-row items-center justify-center border border-gray-100">
                                        <Text className="text-[#D1D5DB] font-bold text-[14px]">Feedback Available Upon Completion</Text>
                                    </View>
                                    <TouchableOpacity className="bg-[#FEF2F2] rounded-full py-4 flex-row items-center justify-center border border-[#FECACA]" activeOpacity={0.7}>
                                        <Text className="text-[#EF4444] font-bold text-[15px]">Cancel Consultation</Text>
                                    </TouchableOpacity>
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
        </>
    );
}
