import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookingSuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function BookingSuccessModal({ visible, onClose }: BookingSuccessModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-8">
                <View className="bg-white rounded-[20px] w-full overflow-hidden shadow-xl">
                    {/* Content */}
                    <View className="px-6 pt-10 pb-8 items-center">
                        {/* Green checkmark icon */}
                        <View className="w-16 h-16 rounded-full bg-[#22C55E] items-center justify-center mb-5">
                            <Ionicons name="checkmark" size={36} color="white" />
                        </View>

                        {/* SUCCESS label */}
                        <Text className="text-[#22C55E] text-[18px] font-extrabold tracking-widest mb-4">
                            SUCCESS
                        </Text>

                        {/* Message */}
                        <Text className="text-[#1F2937] text-[16px] font-semibold text-center leading-6 mb-8">
                            Your appointment request{'\n'}has been received.
                        </Text>

                        {/* Continue button (green) */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-full bg-[#22C55E] rounded-[10px] py-4 items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-[16px] font-bold">
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
