import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HistoryModalProps {
    visible: boolean;
    appointment: any;
    onClose: () => void;
}

export default function HistoryModal({ visible, appointment, onClose }: HistoryModalProps) {
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
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/40">
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

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        {/* Office Category */}
                        <Text className="text-gray-400 text-[14px] font-bold mb-1">Office Category</Text>
                        <Text className="text-[#111827] text-[26px] font-extrabold mb-8 tracking-tight">
                            {appointment.title}
                        </Text>

                        {/* Date and Time Cards */}
                        <View className="flex-row gap-4 mb-8">
                            <View className="flex-1 bg-[#F9FAFB] rounded-[20px] p-5 border border-gray-100">
                                <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Date</Text>
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                                    <Text className="text-gray-600 font-bold text-[14px]">{appointment.date}</Text>
                                </View>
                            </View>
                            <View className="flex-1 bg-[#F9FAFB] rounded-[20px] p-5 border border-gray-100">
                                <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Date</Text>
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="time-outline" size={18} color="#9CA3AF" />
                                    <Text className="text-gray-600 font-bold text-[14px]">{appointment.time}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Detailed Topic */}
                        <Text className="text-gray-400 text-[14px] font-bold mb-3">Detailed Topic</Text>
                        <View className="bg-white border border-gray-100 rounded-[16px] p-5 mb-8 shadow-sm">
                            <Text className="text-gray-400 font-bold text-[15px]">Internship Preparation</Text>
                        </View>

                        {/* Members and Files */}
                        <View className="flex-row mb-12">
                            <View className="flex-1 items-center justify-center">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Ionicons name="people-outline" size={18} color="#9CA3AF" />
                                    <Text className="text-gray-400 font-bold text-[14px]">Members</Text>
                                </View>
                                <Text className="text-gray-300 font-bold text-[13px]">Individual</Text>
                            </View>
                            <View className="w-[1px] h-12 bg-gray-100" />
                            <View className="flex-1 items-center justify-center">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Ionicons name="attach-outline" size={18} color="#9CA3AF" />
                                    <Text className="text-gray-400 font-bold text-[14px]">Files</Text>
                                </View>
                                <Text className="text-gray-300 font-bold text-[13px]">No Upload</Text>
                            </View>
                        </View>

                        {/* Footer Actions */}
                        {isCompleted ? (
                            <View>
                                <View className="bg-[#EFF6FF] rounded-[20px] p-5 flex-row items-center gap-4 mb-4 border border-[#DBEAFE]">
                                    <Ionicons name="information-circle-outline" size={26} color="#1E3A8A" />
                                    <View className="flex-1">
                                        <Text className="text-[#1E3A8A] font-bold text-[14px]">Evaluation is Mandatory</Text>
                                        <Text className="text-[#1E3A8A] font-bold text-[14px]">for Completed Services.</Text>
                                    </View>
                                </View>
                                <TouchableOpacity className="bg-[#0066FF] rounded-full py-4 flex-row items-center justify-center gap-2" activeOpacity={0.8}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
                                    <Text className="text-white font-bold text-[16px]">Leave Required Feedback</Text>
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
    );
}
