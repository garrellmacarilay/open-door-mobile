import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

interface LogoutConfirmationModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function LogoutConfirmationModal({ visible, onCancel, onConfirm }: LogoutConfirmationModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/40 justify-center items-center px-6">
                <View
                    className="bg-white w-full max-w-[320px] rounded-[16px] p-6 items-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 8,
                    }}
                >
                    <Text className="text-[#111827] text-[22px] font-bold mb-4 mt-2">
                        Confirmation
                    </Text>

                    <Text className="text-[#4B5563] text-[15px] font-medium text-center mb-8">
                        Are you sure you want to logout?
                    </Text>

                    <View className="flex-row items-center justify-between w-full h-[45px] gap-4 mb-2">
                        {/* Cancel Button */}
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 h-full items-center justify-center rounded-[8px] bg-white border border-[#D1D5DB]"
                            activeOpacity={0.7}
                        >
                            <Text className="text-[#4B5563] text-[15px] font-bold">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* Confirm Button */}
                        <TouchableOpacity
                            onPress={onConfirm}
                            className="flex-1 h-full items-center justify-center rounded-[8px] bg-[#22C55E]"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-[15px] font-bold">
                                Confirm
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
