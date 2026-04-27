import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Modal, ScrollView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StaffHistoryModalProps {
    visible: boolean;
    appointment: any;
    onClose: () => void;
}

function DeclineModal({
    visible,
    onConfirm,
    onCancel,
}: {
    visible: boolean;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
}) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        onConfirm(reason);
        setReason('');
    };

    const handleCancel = () => {
        setReason('');
        onCancel();
    };

    return (
        <Modal animationType="fade" transparent visible={visible} onRequestClose={handleCancel}>
            <View className="flex-1 bg-black/50 items-center justify-center px-6">
                <View className="bg-white rounded-[24px] p-6 w-full shadow-xl">
                    <Text className="text-[#1C274C] text-[22px] font-extrabold mb-2">
                        Decline Appointment
                    </Text>
                    <Text className="text-gray-500 text-[13px] font-semibold mb-4">
                        Please provide a reason for declining this request
                    </Text>

                    <TextInput
                        value={reason}
                        onChangeText={setReason}
                        placeholder="Explain why the request is being declined..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        className="border border-gray-200 rounded-[14px] p-4 text-[14px] text-gray-800 bg-gray-50 mb-5"
                        style={{ minHeight: 120 }}
                    />

                    <TouchableOpacity
                        onPress={handleConfirm}
                        activeOpacity={0.8}
                        className="bg-[#EF4444] rounded-[14px] py-4 items-center mb-3"
                    >
                        <Text className="text-white font-bold text-[15px]">Confirm Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleCancel}
                        activeOpacity={0.7}
                        className="rounded-[14px] py-4 items-center border border-gray-200"
                    >
                        <Text className="text-gray-600 font-bold text-[15px]">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default function StaffHistoryModal({ visible, appointment, onClose }: StaffHistoryModalProps) {
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    if (!appointment) return null;

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':   return { bg: 'bg-[#FEF9C3] border-[#FEF08A]', text: 'text-[#A16207]' };
            case 'approved':  return { bg: 'bg-[#DCFCE7] border-[#86EFAC]', text: 'text-[#16A34A]' };
            case 'completed': return { bg: 'bg-[#DBEAFE] border-[#93C5FD]', text: 'text-[#2563EB]' };
            case 'declined':  return { bg: 'bg-[#FEE2E2] border-[#FECACA]', text: 'text-[#DC2626]' };
            default:          return { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-600' };
        }
    };

    const statusStyle = getStatusStyle(appointment.status);
    const status = appointment.status.toLowerCase();
    const isPending = status === 'pending';
    const isApproved = status === 'approved';
    const isCompleted = status === 'completed';

    return (
        <>
            <Modal
                animationType="slide"
                transparent
                statusBarTranslucent
                navigationBarTranslucent
                visible={visible}
                onRequestClose={onClose}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 justify-end bg-black/40">
                    <View className="bg-white rounded-t-[32px] p-6 h-[88%] shadow-lg">

                        {/* Header */}
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
                                    <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Time</Text>
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
                            <View className="flex-row mb-8">
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
                            {isPending && (
                                <View className="flex-row gap-4">
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        className="flex-1 bg-[#F44336] rounded-[10px] py-3.5 items-center"
                                        onPress={() => setShowDeclineModal(true)}
                                    >
                                        <Text className="text-white font-bold text-[15px]">Decline</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        className="flex-1 bg-[#45C943] rounded-[10px] py-3.5 items-center"
                                        onPress={() => {
                                            // TODO: approve action
                                            onClose();
                                        }}
                                    >
                                        <Text className="text-white font-bold text-[15px]">Approve</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {isApproved && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="bg-[#4C55F5] rounded-[12px] py-4 items-center justify-center"
                                    onPress={() => {
                                        // TODO: complete action
                                        onClose();
                                    }}
                                >
                                    <Text className="text-white font-bold text-[16px]">Complete</Text>
                                </TouchableOpacity>
                            )}

                            {isCompleted && (
                                <View>
                                    <View className="h-[1px] bg-gray-200 mb-7" />

                                    <Text className="text-gray-400 text-[15px] font-bold mb-4">Student Rating</Text>
                                    <View className="flex-row items-center gap-1 mb-7">
                                        <Ionicons name="star" size={30} color="#E5E7EB" />
                                        <Ionicons name="star" size={30} color="#E5E7EB" />
                                        <Ionicons name="star" size={30} color="#E5E7EB" />
                                        <Ionicons name="star" size={30} color="#E5E7EB" />
                                        <Ionicons name="star" size={30} color="#E5E7EB" />
                                    </View>

                                    <Text className="text-gray-400 text-[15px] font-bold mb-4">Student Feedback</Text>
                                    <View className="bg-white border border-gray-200 rounded-[14px] px-5 py-4">
                                        <Text className="text-gray-400 italic text-[14px] font-medium">
                                            Waiting for student interaction...
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* approved / declined / completed -> no footer actions */}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <DeclineModal
                visible={showDeclineModal}
                onConfirm={(_reason) => {
                    setShowDeclineModal(false);
                    onClose();
                }}
                onCancel={() => setShowDeclineModal(false)}
            />
        </>
    );
}
