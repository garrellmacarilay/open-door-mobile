import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EvaluationModal from './EvaluationModal';
import { BookingHistory } from '@/hooks/studentHooks';
import RescheduleModal from './RescheduleModal';
import api from '@/utils/api';

interface HistoryModalProps {
    visible: boolean;
    appointment: BookingHistory | null;
    onClose: () => void;
}

export default function HistoryModal({ visible, appointment, onClose }: HistoryModalProps) {
    const [showEvaluation, setShowEvaluation] = useState(false);
    const [showReschedule, setShowReschedule] = useState(false);

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
    const isApproved = appointment.status.toLowerCase() === 'approved';
    const isDeclined = appointment.status.toLowerCase() === 'declined';
     const isPending = appointment.status.toLowerCase() === 'pending';
    const alreadyHasFeedback = appointment.hasFeedback;

    const handleCancel = () => {
        Alert.alert(
            "Cancel Consultation",
            "Are you sure you want to cancel this booking? This action cannot be undone.",
            [
                { text: "No, Keep it", style: "cancel" },
                { 
                    text: "Yes, Cancel", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Assuming your api instance is accessible
                            const res = await api.patch(`/cancel/booking/${appointment.id}`);
                            
                            if (res.data.success) {
                                Alert.alert("Success", "Booking has been cancelled.");
                                onClose(); 
                            }
                        } catch (error: any) {
                            const msg = error.response?.data?.message || "Failed to cancel";
                            Alert.alert("Error", msg);
                        }
                    }
                }
            ]
        );
    };

    return (
        <>
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
                                    {appointment.reference_code}
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
                                {appointment.office_name}
                            </Text>

                            {/* Date and Time Cards */}
                            <View className="flex-row gap-4 mb-8">
                                <View className="flex-1 bg-[#F9FAFB] rounded-[20px] p-5 border border-gray-100">
                                    <Text className="text-gray-400 text-[13px] font-bold mb-3">Booked Date</Text>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-600 font-bold text-[14px]">
                                            {new Date(appointment.consultation_date).toLocaleDateString('en-US', {
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
                                        <Text className="text-gray-600 font-bold text-[14px]">
                                            {new Date(appointment.consultation_date).toLocaleTimeString('en-US', {
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
                                <Text className="text-gray-400 font-bold text-[15px]">
                                    { appointment.concern_description }
                                </Text>
                            </View>

                            {/* Members and Files */}
                            <View className="flex-row mb-12">
                                <View className="flex-1 items-center justify-center">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Ionicons name="people-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-bold text-[14px]">Members</Text>
                                    </View>
                                    <Text className="text-gray-300 font-bold text-[13px]">{appointment.group_members ?? 'Individual'}</Text>
                                </View>
                                <View className="w-[1px] h-12 bg-gray-100" />
                                <View className="flex-1 items-center justify-center">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Ionicons name="attach-outline" size={18} color="#9CA3AF" />
                                        <Text className="text-gray-400 font-bold text-[14px]">Files</Text>
                                    </View>
                                    <Text className="text-gray-300 font-bold text-[13px]">{appointment.attachment_name ?? "No Upload"}</Text>
                                </View>
                            </View>

                            {/* Footer Actions */}
                            {isCompleted ? (
                                alreadyHasFeedback ? (
                                    /* SHOW THIS IF ALREADY SUBMITTED */
                                    <View className="bg-green-50 rounded-[20px] p-5 border border-green-100">
                                        <View className="flex-row items-center gap-3 mb-2">
                                            <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                                            <Text className="text-[#16A34A] font-bold text-[16px]">Feedback Submitted</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Ionicons key={s} name="star" size={14} color={s <= (appointment.rating ?? 0) ? "#FBBF24" : "#D1D5DB"} />
                                            ))}
                                        </View>
                                        <Text className="text-gray-500 italic text-[13px]">"{appointment.comment}"</Text>
                                    </View>
                                ) : (
                                    <View>
                                        <View className="bg-[#EFF6FF] rounded-[20px] p-5 flex-row items-center gap-4 mb-4 border border-[#DBEAFE]">
                                            <Ionicons name="information-circle-outline" size={26} color="#1E3A8A" />
                                            <View className="flex-1">
                                                <Text className="text-[#1E3A8A] font-bold text-[14px]">Evaluation is Mandatory</Text>
                                                <Text className="text-[#1E3A8A] font-bold text-[14px]">for Completed Services.</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            className="bg-[#0066FF] rounded-full py-4 flex-row items-center justify-center gap-2"
                                            activeOpacity={0.8}
                                            onPress={() => setShowEvaluation(true)}
                                        >
                                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="white" />
                                            <Text className="text-white font-bold text-[16px]">Leave Required Feedback</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            ) : (
                                <View className="gap-3">
                                    <View className="bg-[#F3F4F6] rounded-full py-3.5 flex-row items-center justify-center border border-gray-200">
                                        <Text className="text-[#D1D5DB] font-bold text-[14px]">Feedback Available Upon Completion</Text>
                                    </View>
                                        <TouchableOpacity className="bg-[#FEF2F2] rounded-full py-4 flex-row items-center justify-center border border-[#FECACA]" activeOpacity={0.7} onPress={handleCancel}>
                                            <Text className="text-[#EF4444] font-bold text-[15px]">Cancel Consultation</Text>
                                        </TouchableOpacity>
                                    {(isApproved || isDeclined) && (
                                        <TouchableOpacity
                                            className="bg-[#16264D] rounded-full py-3.5 flex-row items-center justify-center gap-2"
                                            onPress={() => setShowReschedule(true)} 
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

            <EvaluationModal
                visible={showEvaluation}
                appointmentTitle={appointment?.office_name}
                bookingId={appointment?.id}
                studentId={appointment?.student_id}
                officeId={appointment?.office_id}
                onClose={() => setShowEvaluation(false)}
            />

            <RescheduleModal 
                visible={showReschedule}
                appointment={appointment}
                onClose={() => setShowReschedule(false)}
                onRefresh={() => { 
                    onClose();    // Close the history detail modal
                }}
        />
        </>
    );
}