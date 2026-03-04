import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookingInfoModalProps {
    visible: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export default function BookingInfoModal({ visible, onClose, onContinue }: BookingInfoModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-8">
                <View className="bg-white rounded-[20px] w-full overflow-hidden shadow-xl">
                    {/* Close button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-4 right-4 z-10 p-1"
                        activeOpacity={0.6}
                    >
                        <Ionicons name="close" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Content */}
                    <View className="px-6 pt-10 pb-6">
                        {/* Info box */}
                        <View className="bg-gray-100 rounded-[12px] px-5 py-5 mb-8">
                            <Text className="text-[#1F2937] text-[15px] font-semibold leading-6 text-center">
                                Booking a schedule must be done{'\n'}
                                2 days before the scheduled date.
                            </Text>
                        </View>

                        {/* Continue button */}
                        <TouchableOpacity
                            onPress={onContinue}
                            className="w-full bg-[#18233D] rounded-[10px] py-4 items-center justify-center"
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
