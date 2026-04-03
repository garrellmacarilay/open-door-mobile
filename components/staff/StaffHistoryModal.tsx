import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, Modal, ScrollView, TextInput, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EvaluationModal from '../student/EvaluationModal';
import { Appointment } from '@/hooks/staffHooks';
import {useUpdateStatus} from '@/hooks/staffAdminHooks';

interface StaffHistoryModalProps {
    visible: boolean;
    appointment: Appointment | null;   
    onClose: () => void;
    onRefresh: () => void;
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

export default function StaffHistoryModal({ visible, appointment, onClose, onRefresh }: StaffHistoryModalProps) {
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const { updateStatus, loading } = useUpdateStatus();
    const [actionType, setActionType] = useState<'approved' | 'declined' | null>(null);

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

    const statusStyle = getStatusStyle(appointment.details.status);
    const status = appointment.details.status.toLowerCase();
    const isPending = status === 'pending';
    const isCompleted = status === 'completed';

    const handleAction = async (newStatus: 'approved' | 'declined', reason?: string) => {

        const payload = {
            status: newStatus,
            ...(reason ? {declined_reason: reason} : {})
        }
        const success = await updateStatus(appointment.id, payload);

        if (success) {
            onRefresh(); // Refresh the list in the background
            onClose();   // Close the modal
        }
        setActionType(null);
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent
                visible={visible}
                onRequestClose={onClose}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white rounded-t-[32px] p-6 h-[88%] shadow-lg">

                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-8 mt-2">
                            <View className="flex-row items-center gap-3">
                                <View className={`px-4 py-1.5 rounded-full border ${statusStyle.bg}`}>
                                    <Text className={`text-[12px] font-bold capitalize ${statusStyle.text}`}>
                                        {appointment.details.status}
                                    </Text>
                                </View>
                                <Text className="text-gray-400 text-[13px] font-bold tracking-wider">
                                    {appointment.details.reference_code}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.6}>
                                <Ionicons name="close" size={26} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                            {/* Office Category */}
                            <Text className="text-gray-400 text-[14px] font-bold mb-1">Student Name</Text>
                            <Text className="text-[#111827] text-[26px] font-extrabold mb-8 tracking-tight">
                                {appointment.title}
                            </Text>

                            {/* Date and Time Cards */}
                            <View className="flex-row gap-4 mb-8">
                                <View className="flex-1 bg-[#F9FAFB] rounded-[20px] p-5 border border-gray-100">
                                    <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Date</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-600 font-bold text-[14px]">{new Date(appointment.start).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-1 bg-[#F9FAFB] rounded-[20px] p-5 border border-gray-100">
                                    <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Time</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="time-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-600 font-bold text-[14px]">{new Date(appointment.start).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Detailed Topic */}
                            <Text className="text-gray-400 text-[14px] font-bold mb-3">Detailed Topic</Text>
                            <View className="bg-white border border-gray-100 rounded-[16px] p-5 mb-8 shadow-sm">
                                <Text className="text-gray-400 font-bold text-[15px]">{appointment.details.concern_description}</Text>
                            </View>

                            {/* Members and Files */}
                            <View className="flex-row mb-8">
                                <View className="flex-1 items-center justify-center">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Ionicons name="people-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-bold text-[14px]">Members</Text>
                                    </View>
                                    <Text className="text-gray-300 font-bold text-[13px]">{appointment.details.group_members ?? 'Individual' }</Text>
                                </View>
                                <View className="w-[1px] h-12 bg-gray-100" />
                                <View className="flex-1 items-center justify-center">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Ionicons name="attach-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-bold text-[14px]">Files</Text>
                                    </View>
                                    <Text className="text-gray-300 font-bold text-[13px]">{appointment.details.attachment_name ?? 'No Upload'}</Text>
                                </View>
                            </View>

                            {/* Footer Actions */}
                            {isPending && (
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        className="flex-1 bg-[#DCFCE7] border border-[#86EFAC] rounded-[14px] py-4 items-center"
                                        onPress={() => {
                                            handleAction('approved')
                                        }}
                                        disabled={loading}
                                    >
                                        {loading && actionType === 'approved'? (
                                            <ActivityIndicator color="#16A34A" />
                                        ) : (
                                            <Text className={`text-[#16A34A] font-bold ${loading && actionType === 'declined' ? 'opacity-50' : ''}`}>
                                                Approve
                                            </Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        className="flex-1 bg-[#FEE2E2] border border-[#FECACA] rounded-[14px] py-4 items-center"
                                        onPress={() => setShowDeclineModal(true)}
                                        disabled={loading}
                                    >
                                        {loading && actionType === 'declined' ? (
                                            <ActivityIndicator color="#DC2626" />
                                        ) : (
                                            <Text className={`text-[#DC2626] font-bold ${loading && actionType === 'approved' ? 'opacity-50' : ''}`}>
                                                Decline
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}

                            {isCompleted && (
                                <View>
                                    <View className="bg-[#F0FDF4] rounded-[20px] p-5 flex-row items-center gap-4 mb-4 border border-[#BBF7D0]">
                                        <Ionicons name="information-circle-outline" size={26} color="#166534" />
                                        <View className="flex-1">
                                            <Text className="text-[#166534] font-bold text-[14px]">Evaluation is Mandatory</Text>
                                            <Text className="text-[#166534] font-bold text-[14px]">for Completed Services.</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-[#0F766E] rounded-full py-4 flex-row items-center justify-center gap-2"
                                        activeOpacity={0.8}
                                        onPress={() => setShowEvaluation(true)}
                                    >
                                        <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
                                        <Text className="text-white font-bold text-[16px]">Leave Required Feedback</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* approved / declined → no footer actions */}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <DeclineModal
                visible={showDeclineModal}
                onConfirm={(reason) => {
                    setShowDeclineModal(false);
                    handleAction('declined', reason);
                }}
                onCancel={() => setShowDeclineModal(false)}
            />

            <EvaluationModal
                visible={showEvaluation}
                appointmentTitle={appointment?.title}
                onClose={() => setShowEvaluation(false)}
            />
        </>
    );
}
