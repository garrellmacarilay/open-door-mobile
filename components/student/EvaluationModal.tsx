import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubmitFeedback } from '@/hooks/studentHooks';

interface EvaluationModalProps {
    visible: boolean;
    onClose: () => void;

    appointmentTitle?: string;
    bookingId: number;
    officeId: number;
    studentId: number;
}

export default function EvaluationModal({ visible, onClose, appointmentTitle, bookingId, officeId, studentId }: EvaluationModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { submitFeedback, isSubmitting } = useSubmitFeedback();

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a star rating before submitting.');
            return;
        }
        if (!comment.trim()) {
            Alert.alert('Feedback Required', 'Please write your feedback before submitting.');
            return;
        }

        const result = await submitFeedback({
            booking_id: bookingId,
            student_id: studentId,
            office_id: officeId,
            rating: rating,
            comment: comment.trim(),

        });

        if (result.success) {
            Alert.alert('Success', result.message, [
                { text: 'OK', onPress: handleDismiss }
            ]);
        } else {
            Alert.alert('Submission Failed', result.message);
        }
    };

    const handleDismiss = () => {
        setRating(0);
        setComment('');
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleDismiss}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-6">
                <View
                    className="bg-white w-full rounded-[24px] overflow-hidden"
                    style={{
                        borderWidth: 1.5,
                        borderColor: '#60A5FA',
                        shadowColor: '#3B82F6',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 8,
                    }}
                >
                    {/* Content */}
                    <View className="px-8 pt-8 pb-8 items-center">

                        {/* Title */}
                        <Text className="text-[#1F2937] text-[22px] font-extrabold mb-6">
                            Evaluation
                        </Text>

                        {/* Star Rating */}
                        <View className="flex-row items-center justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    disabled={isSubmitting}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={38}
                                        color={star <= rating ? '#FBBF24' : '#D1D5DB'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Feedback Text Area */}
                        <View
                            className="w-full rounded-[14px] bg-white mb-8"
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                minHeight: 130,
                            }}
                        >
                            <TextInput
                                className="flex-1 px-4 py-4 text-[14px] text-[#1F2937]"
                                placeholder="Feedback is necessary&#10;for evaluation..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={5}
                                style={{ textAlignVertical: 'top', minHeight: 130 }}
                                value={comment}
                                onChangeText={setComment}
                                editable={!isSubmitting}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-[#2563EB] rounded-full py-4 items-center justify-center mb-4"
                            activeOpacity={0.85}
                            style={{
                                shadowColor: '#2563EB',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-[16px] font-bold">Submit</Text>
                            )}
                        </TouchableOpacity>

                        {/* Dismiss */}
                        <TouchableOpacity onPress={handleDismiss} disabled={isSubmitting} activeOpacity={0.6}>
                            <Text className="text-[#6B7280] text-[14px] font-semibold">
                                Dismiss
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    );
}
