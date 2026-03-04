import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EvaluationModalProps {
    visible: boolean;
    onClose: () => void;
    appointmentTitle?: string;
}

export default function EvaluationModal({ visible, onClose, appointmentTitle }: EvaluationModalProps) {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert('Rating Required', 'Please select a star rating before submitting.');
            return;
        }
        if (!feedback.trim()) {
            Alert.alert('Feedback Required', 'Please write your feedback before submitting.');
            return;
        }
        Alert.alert('Thank you!', 'Your evaluation has been submitted successfully.', [
            { text: 'OK', onPress: () => { setRating(0); setFeedback(''); onClose(); } }
        ]);
    };

    const handleDismiss = () => {
        setRating(0);
        setFeedback('');
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
                                value={feedback}
                                onChangeText={setFeedback}
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
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
                            <Text className="text-white text-[16px] font-bold">
                                Submit
                            </Text>
                        </TouchableOpacity>

                        {/* Dismiss */}
                        <TouchableOpacity onPress={handleDismiss} activeOpacity={0.6}>
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
