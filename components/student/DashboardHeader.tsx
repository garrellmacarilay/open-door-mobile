import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Bell, Plus } from 'lucide-react-native';
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
    onPlusPress?: () => void;
}

export default function DashboardHeader({
    title = "Dashboard",
    user,
    onProfilePress,
    onNotificationPress,
    onPlusPress
}: DashboardHeaderProps) {
    const router = useRouter();

    const handleProfilePress = () => {
        if (onProfilePress) {
            onProfilePress();
        } else {
            router.push('/(student)/settings');
        }
    };

    const handleNotificationPress = () => {
        if (onNotificationPress) {
            onNotificationPress();
        } else {
            router.push('/(student)/notifications');
        }
    };

    const handlePlusPress = () => {
        if (onPlusPress) {
            onPlusPress();
        } else {
            router.push('/(student)/consultation');
        }
    };

    return (
        <View className="bg-[#18233D] px-6 py-4 flex-row items-center justify-between">
            {/* OpenDoor Logo/Brand */}
            <Text className="text-white text-[28px] font-extrabold tracking-tight">
                OpenDoor
            </Text>

            <View className="flex-row items-center gap-4">
                {/* Plus Icon */}
                <TouchableOpacity
                    onPress={handlePlusPress}
                    className="w-10 h-10 rounded-full border-[1.5px] border-white items-center justify-center bg-[#1C274C] shadow-sm ml-2"
                    activeOpacity={0.8}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Notification Icon */}
                <TouchableOpacity
                    onPress={handleNotificationPress}
                    className="items-center justify-center p-1"
                    activeOpacity={0.7}
                >
                    <Bell size={24} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Profile Icon */}
                <TouchableOpacity
                    onPress={handleProfilePress}
                    className="w-11 h-11 rounded-full overflow-hidden border-[2px] border-white items-center justify-center bg-gray-200 shadow-sm ml-1"
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: user?.avatar || 'https://xsgames.co/randomusers/assets/avatars/female/72.jpg' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
