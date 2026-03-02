import { useRouter } from 'expo-router';
import { Camera, EyeOff, Eye, LogOut, Mail, User } from 'lucide-react-native';
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
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function UserSettingsPage() {
    const router = useRouter();
    const [name, setName] = useState('Eunice Lugtu');
    const [email] = useState('molud@student.laverdad.edu.ph');
    const [currentPassword, setCurrentPassword] = useState('password123');
    const [newPassword, setNewPassword] = useState('password123');
    const [confirmPassword, setConfirmPassword] = useState('password123');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Handle image picker
    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
            return;
        }

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
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => router.replace('/(auth)/login'),
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                >
                    {/* Top White Section */}
                    <View className="bg-white rounded-b-[40px] border-b border-l border-r border-[#E5E7EB]" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 3,
                    }}>
                        <View className="px-6 pt-6 pb-10">
                            {/* Header Title */}
                            <Text className="text-3xl font-extrabold text-[#1C274C] mb-8">Profile</Text>

                            {/* Profile Image */}
                            <View className="items-center mb-10">
                                <View className="relative">
                                    <View className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-[#0066FF] bg-gray-100 flex items-center justify-center">
                                        {profileImage ? (
                                            <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
                                        ) : (
                                            <User size={48} color="#9CA3AF" strokeWidth={1.5} />
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleImagePicker}
                                        className="absolute -bottom-1 -right-1 w-[34px] h-[34px] rounded-full bg-[#0066FF] border-2 border-white flex items-center justify-center"
                                        activeOpacity={0.8}
                                    >
                                        <Camera size={16} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Form Fields */}
                            <View>
                                {/* Name */}
                                <View className="mb-4">
                                    <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Name</Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        className="w-full px-4 py-3.5 border border-gray-300 rounded-[10px] text-[#1C274C] font-semibold text-[15px]"
                                    />
                                </View>

                                {/* Email Address */}
                                <View className="mb-4">
                                    <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Email Address</Text>
                                    <View className="w-full flex-row items-center border border-gray-300 rounded-[10px] px-4 py-3.5">
                                        <Mail size={18} color="#6B7280" />
                                        <TextInput
                                            value={email}
                                            editable={false}
                                            className="flex-1 ml-2.5 text-gray-400 font-semibold text-[15px]"
                                        />
                                    </View>
                                </View>

                                {/* Current Password */}
                                <View className="mb-4">
                                    <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Current Password</Text>
                                    <View className="w-full flex-row items-center justify-between border border-gray-300 rounded-[10px] px-4 py-3.5">
                                        <TextInput
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                            secureTextEntry={!showCurrent}
                                            className="flex-1 text-[#1C274C] font-bold text-[18px] tracking-widest pt-1"
                                        />
                                        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                                            {showCurrent ? <Eye size={18} color="#6B7280" /> : <EyeOff size={18} color="#6B7280" />}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* New Password */}
                                <View className="mb-4">
                                    <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">New Password</Text>
                                    <View className="w-full flex-row items-center justify-between border border-gray-300 rounded-[10px] px-4 py-3.5">
                                        <TextInput
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                            secureTextEntry={!showNew}
                                            className="flex-1 text-[#1C274C] font-bold text-[18px] tracking-widest pt-1"
                                        />
                                        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                            {showNew ? <Eye size={18} color="#6B7280" /> : <EyeOff size={18} color="#6B7280" />}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Confirm Password */}
                                <View>
                                    <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Confirm Password</Text>
                                    <View className="w-full flex-row items-center justify-between border border-gray-300 rounded-[10px] px-4 py-3.5">
                                        <TextInput
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry={!showConfirm}
                                            className="flex-1 text-[#1C274C] font-bold text-[18px] tracking-widest pt-1"
                                        />
                                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <Eye size={18} color="#6B7280" /> : <EyeOff size={18} color="#6B7280" />}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Bottom Buttons */}
                    <View className="px-6 pt-10 pb-8 flex-col gap-y-4">
                        <TouchableOpacity
                            onPress={handleSaveChanges}
                            disabled={isSaving}
                            className={`w-full py-3.5 rounded-[8px] flex-row justify-center items-center ${isSaving ? 'bg-[#0066FF]/70' : 'bg-[#0066FF]'}`}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-center font-medium text-[16px]">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="w-full py-3.5 rounded-[8px] flex-row justify-center items-center bg-[#FEF2F2] border border-[#FECACA]"
                            activeOpacity={0.8}
                        >
                            <LogOut size={18} color="#EF4444" />
                            <Text className="text-[#EF4444] text-center font-medium text-[16px] ml-2">
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
