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
        <View className="bg-white shadow-sm px-4 pt-4 pb-4 flex-row items-center justify-between">
            <Text className="text-black text-2xl font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                {title}
            </Text>

            <View className="flex-row items-center gap-3">
                {/* Notification Icon */}
                <TouchableOpacity
                    onPress={onNotificationPress}
                    className="w-10 h-10 items-center justify-center"
                >
                    <View className="relative">
                        <Ionicons name="notifications-outline" size={24} color="black" />
                        <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                    </View>
                </TouchableOpacity>

                {/* Profile Info */}
                <TouchableOpacity
                    onPress={handleProfilePress}
                    className="flex-row items-center gap-2"
                >
                    <View className="items-end hidden md:flex">
                        <Text className="text-sm font-semibold text-gray-900">{user?.name || 'Student'}</Text>
                    </View>

                    <View className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100 items-center justify-center">
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} className="w-full h-full" />
                        ) : (
                            <Ionicons name="person" size={20} color="#6b7280" />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
