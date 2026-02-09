import { useRouter } from 'expo-router';
import { Camera, LogOut, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function UserSettingsPage() {
    const router = useRouter();
    const [username, setUsername] = useState('Garrell Macarilay');
    const [email] = useState('garrell.macarilay@example.com');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Handle image picker
    const handleImagePicker = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            Alert.alert('Success', 'Your profile has been updated successfully!');
        }, 1500);
    };

    // Handle logout
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // Navigate to login screen
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };


    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-6 py-4 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center -ml-2"
                        activeOpacity={0.7}
                    >
                        <Text className="text-blue-600 text-[16px] font-medium">← Back</Text>
                    </TouchableOpacity>
                    <Text className="text-[20px] font-semibold text-gray-900">
                        Settings
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            {/* Scrollable Content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Picture Section */}
                    <View className="items-center pt-8 pb-6 bg-white mb-4">
                        <View className="relative">
                            {/* Profile Image */}
                            <View
                                className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden items-center justify-center"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 4,
                                }}
                            >
                                {profileImage ? (
                                    <Image
                                        source={{ uri: profileImage }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <User size={48} color="#9CA3AF" strokeWidth={1.5} />
                                )}
                            </View>

                            {/* Camera Overlay Button */}
                            <TouchableOpacity
                                onPress={handleImagePicker}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full items-center justify-center"
                                activeOpacity={0.8}
                                style={{
                                    shadowColor: '#2563EB',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 6,
                                }}
                            >
                                <Camera size={20} color="#FFFFFF" strokeWidth={2} />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-[14px] text-gray-500 mt-3">
                            Tap to change profile picture
                        </Text>
                    </View>

                    {/* Editable Profile Section */}
                    <View className="px-6 mb-4">
                        <View
                            className="bg-white rounded-2xl p-5"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <Text className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Profile Information
                            </Text>

                            {/* Username Field */}
                            <View className="mb-4">
                                <View className="flex-row items-center mb-2">
                                    <User size={16} color="#6B7280" strokeWidth={2} />
                                    <Text className="text-[14px] font-medium text-gray-700 ml-2">
                                        Username
                                    </Text>
                                </View>
                                <TextInput
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 bg-white text-[15px]"
                                    placeholderTextColor="#9CA3AF"
                                    style={{
                                        fontFamily: 'System',
                                    }}
                                />
                            </View>

                            {/* Email Field (Read-Only) */}
                            <View>
                                <View className="flex-row items-center mb-2">
                                    <Mail size={16} color="#6B7280" strokeWidth={2} />
                                    <Text className="text-[14px] font-medium text-gray-700 ml-2">
                                        Email Address
                                    </Text>
                                    <View className="ml-2 px-2 py-0.5 bg-gray-100 rounded">
                                        <Text className="text-[10px] text-gray-600 font-medium">
                                            READ-ONLY
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    className="w-full px-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50"
                                >
                                    <Text className="text-[15px] text-gray-500">
                                        {email}
                                    </Text>
                                </View>
                                <Text className="text-[12px] text-gray-400 mt-1.5 ml-1">
                                    Email cannot be changed. Contact support if needed.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Save Changes Button */}
                    <View className="px-6 mb-6">
                        <TouchableOpacity
                            onPress={handleSaveChanges}
                            disabled={isSaving}
                            className={`w-full py-4 rounded-xl ${isSaving ? 'bg-blue-400' : 'bg-blue-600'
                                }`}
                            activeOpacity={0.8}
                            style={{
                                shadowColor: '#2563EB',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                        >
                            <Text className="text-white text-center font-bold text-[16px]">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Additional Settings (Optional) */}
                    <View className="px-6 mb-4">
                        <View
                            className="bg-white rounded-2xl p-5"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <Text className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Preferences
                            </Text>

                            <TouchableOpacity
                                className="flex-row items-center justify-between py-3 border-b border-gray-100"
                                activeOpacity={0.7}
                            >
                                <Text className="text-[15px] text-gray-700">Notifications</Text>
                                <Text className="text-[14px] text-gray-400">Enabled</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center justify-between py-3"
                                activeOpacity={0.7}
                            >
                                <Text className="text-[15px] text-gray-700">Language</Text>
                                <Text className="text-[14px] text-gray-400">English</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Logout Button - Inside ScrollView */}
                    <View className="px-6 mb-24">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="w-full py-4 rounded-xl bg-red-50 border border-red-200"
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center justify-center">
                                <LogOut size={20} color="#DC2626" strokeWidth={2} />
                                <Text className="text-red-600 text-center font-semibold text-[16px] ml-2">
                                    Logout
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
