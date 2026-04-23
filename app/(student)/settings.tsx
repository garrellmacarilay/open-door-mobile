import { useRouter } from 'expo-router';
import { Camera, EyeOff, Eye, LogOut, Mail, User, Pencil } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
    Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import LogoutConfirmationModal from '../../components/common/LogoutConfirmationModal';
import { useLogout } from '@/hooks/authHooks';
import { useProfile } from '@/hooks/globalHooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UserSettingsPage() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // 1. UI Control States
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // 2. Hook Integration
    const { 
        user, 
        fullName, 
        setFullName, 
        profileImageUrl,     // The original/saved URL
        preview,             // The temporary base64/blob preview
        setProfileAndPreview, 
        message, 
        currPassword,
        setCurrPassword,
        password, 
        setPassword, 
        passwordConfirmation, 
        setPasswordConfirmation, 
        handleSubmit 
    } = useProfile();

    const { handleLogout: executeLogout, loading: isLoggingOut } = useLogout();

    // 3. Refined Image Picker
    const handleImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permissions.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            // Format for FormData compatibility in React Native
            const imageFile = {
                uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
                name: asset.fileName || 'profile.jpg',
                type: asset.mimeType || 'image/jpeg',
            };
            setProfileAndPreview(imageFile as any);
        }
    };

    // 4. Combined Save Logic
    const onSavePressed = async () => {
        Keyboard.dismiss();
        setIsSaving(true);
        try {
            await handleSubmit();
            // We use a small delay or check the message to exit edit mode
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated!');
        } catch (err) {
            Alert.alert('Error', 'Update failed.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoutTrigger = () => {
        setShowLogoutModal(true);
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
                    <View className="bg-white rounded-b-[40px] border-b border-l border-r border-[#E5E7EB]" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 3,
                    }}>
                        <View className="px-6 pt-8 pb-10">
                            <View className="flex-row justify-between items-center mb-10">
                                <Text className="text-3xl font-extrabold text-[#1C274C]">Profile</Text>
                                {!isEditing && (
                                    <TouchableOpacity
                                        onPress={() => setIsEditing(true)}
                                        className="w-9 h-9 bg-gray-100 rounded-[10px] items-center justify-center border border-gray-200"
                                        activeOpacity={0.7}
                                    >
                                        <Pencil size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Profile Image - Using 'preview' for immediate feedback */}
                            <View className="items-center mb-8">
                                <View className="relative">
                                    <View className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-[#0066FF] bg-gray-100 flex items-center justify-center">
                                        {(preview || profileImageUrl) ? (
                                            <Image 
                                                source={{ uri: preview || profileImageUrl || '' }} 
                                                className="w-full h-full" 
                                                resizeMode="cover" 
                                            />
                                        ) : (
                                            <User size={48} color="#9CA3AF" />
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleImagePicker}
                                        className="absolute -bottom-1 -right-1 w-[34px] h-[34px] rounded-full bg-[#0066FF] border-2 border-white items-center justify-center"
                                    >
                                        <Camera size={16} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {!isEditing ? (
                                <View className="items-center pb-2">
                                    <Text className="text-[24px] font-extrabold text-[#1C274C] mb-3">{fullName}</Text>
                                    <View className="flex-row items-center justify-center mb-4">
                                        <Mail size={15} color="#9CA3AF" />
                                        <Text className="text-[#9CA3AF] font-bold text-[14px] ml-2">{(user as any)?.email}</Text>
                                    </View>
                                    <View className="flex-row items-center justify-center">
                                        <Ionicons name="school-outline" size={18} color="#0066FF" />
                                        <Text className="text-[#0066FF] font-extrabold text-[15px] ml-2">Student</Text>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <View className="mb-4">
                                        <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Name</Text>
                                        <TextInput
                                            value={fullName}
                                            onChangeText={setFullName}
                                            placeholder='Enter your name'
                                            placeholderTextColor="#9CA3AF"
                                            className="w-full px-4 py-3.5 border border-gray-300 rounded-[10px] text-[#1C274C] font-semibold text-[15px]"
                                        />
                                    </View>

                                    <View className="mb-4">
                                        <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Email Address</Text>
                                        <View className="w-full flex-row items-center border border-gray-300 rounded-[10px] px-4 py-3.5 bg-gray-50">
                                            <Mail size={18} color="#6B7280" />
                                            <Text className="flex-1 ml-2.5 text-gray-400 font-semibold text-[15px]" numberOfLines={1} ellipsizeMode="tail">
                                                {(user as any)?.email}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="mb-4">
                                        <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Current Password</Text>
                                        <View className="w-full flex-row items-center justify-between border border-gray-300 rounded-[10px] px-4 py-3.5">
                                            <TextInput
                                                value={currPassword}
                                                onChangeText={setCurrPassword}
                                                secureTextEntry={!showCurrent}
                                                placeholder="Enter your current password"
                                                placeholderTextColor="#9CA3AF"
                                                className="flex-1 text-[#1C274C] font-bold text-[16px] p-0"
                                            />
                                            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                                                {showCurrent ? <Eye size={18} color="#6B7280" /> : <EyeOff size={18} color="#6B7280" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                    <View className="mb-4">
                                        <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">New Password</Text>
                                        <View className="w-full flex-row items-center justify-between border border-gray-300 rounded-[10px] px-4 py-3.5">
                                            <TextInput
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry={!showPassword}
                                                placeholder='Enter your new password'
                                                placeholderTextColor="#9CA3AF"
                                                className="flex-1 text-[#1C274C] font-bold text-[16px] p-0"
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <Eye size={18} color="#6B7280" /> : <EyeOff size={18} color="#6B7280" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-[13px] font-bold text-gray-500 mb-1.5 ml-1">Confirm Password</Text>
                                        <View className="w-full flex-row items-center justify-between border border-gray-300 rounded-[10px] px-4 py-3.5">
                                            <TextInput
                                                value={passwordConfirmation}
                                                onChangeText={setPasswordConfirmation}
                                                secureTextEntry={!showConfirm}
                                                placeholder='Confirm new password'
                                                placeholderTextColor="#9CA3AF"
                                                className="flex-1 text-[#1C274C] font-bold text-[16px] p-0"
                                            />
                                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                                {showConfirm ? <Eye size={18} color="#6B7280" /> : <EyeOff size={18} color="#6B7280" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    <View 
                        className="px-6 pt-8 pb-8 flex-col gap-y-4"
                        style={{ paddingBottom: Math.max(insets.bottom + 36, 130) }}
                    
                    >
                        {isEditing && (
                            <TouchableOpacity
                                onPress={onSavePressed}
                                disabled={isSaving}
                                className={`w-full py-4 rounded-full flex-row justify-center items-center ${isSaving ? 'bg-[#0066FF]/70' : 'bg-[#0066FF]'}`}
                            >
                                {isSaving ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-[15px]">Save Changes</Text>}
                            </TouchableOpacity>
                            
                        )}

                        {!isEditing && (
                            <TouchableOpacity
                                onPress={() => setShowLogoutModal(true)}
                                className="w-full py-4 rounded-full flex-row justify-center items-center bg-[#FEF2F2] border border-[#FECACA]"
                                activeOpacity={0.8}
                            >
                                <LogOut size={18} color="#EF4444" />
                                <Text className="text-[#EF4444] text-center font-bold text-[15px] ml-2">
                                    Logout
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <LogoutConfirmationModal
                visible={showLogoutModal}
                loading={isLoggingOut}
                onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
                onConfirm={async () => {
                    try {
                        await executeLogout();
                    } catch (err) {
                        setShowLogoutModal(false);
                        Alert.alert("Error", "Could not log out.");
                    }
                }}
            />
        </View>
    );
}