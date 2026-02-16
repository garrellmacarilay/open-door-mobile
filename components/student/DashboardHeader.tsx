import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface DashboardHeaderProps {
    title?: string;
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    onProfilePress?: () => void;
    onNotificationPress?: () => void;
}

export default function DashboardHeader({
    title = "Dashboard",
    user,
    onProfilePress,
    onNotificationPress
}: DashboardHeaderProps) {
    const router = useRouter();

    const handleProfilePress = () => {
        if (onProfilePress) {
            onProfilePress();
        } else {
            router.push('/(student)/settings');
        }
    };

    return (
        <View className="bg-[#1C2A48] px-5 py-4 flex-row items-center justify-between">
            {/* OpenDoor Logo/Brand */}
            <Text className="text-white text-xl font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                OpenDoor
            </Text>

            <View className="flex-row items-center gap-4">
                {/* Notification Icon */}
                <TouchableOpacity
                    onPress={onNotificationPress}
                    className="w-9 h-9 items-center justify-center"
                >
                    <View className="relative">
                        <Ionicons name="notifications-outline" size={22} color="white" />
                        <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#1C2A48]" />
                    </View>
                </TouchableOpacity>

                {/* Profile Icon */}
                <TouchableOpacity
                    onPress={handleProfilePress}
                    className="w-9 h-9 rounded-full bg-white/20 overflow-hidden border border-white/30 items-center justify-center"
                >
                    {user?.avatar ? (
                        <Image source={{ uri: user.avatar }} className="w-full h-full" />
                    ) : (
                        <Ionicons name="person" size={18} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
