import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email?: string }>();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleContinue = () => {
        if (!password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        router.replace('/(auth)/password-changed');
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />

            <Image
                source={require('../../assets/images/lvccgate.jpg')}
                className="absolute top-0 left-0 right-0 h-[52%] w-[100%]"
                style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
                resizeMode="cover"
            />

            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                className="absolute top-0 left-0 right-0 h-[52%]"
                style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
            />

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="items-center mt-2 mb-6">
                            <View className="w-full flex-row items-center mb-2">
                                <TouchableOpacity
                                    onPress={() => router.back()}
                                    activeOpacity={0.7}
                                    className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                                >
                                    <ArrowLeft size={20} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>

                            <View className="p-4">
                                <Image
                                    source={require('../../assets/images/psaslogo.png')}
                                    className="w-28 h-28"
                                    resizeMode="contain"
                                />
                            </View>

                            <Text className="text-[30px] font-bold text-white text-center mb-10 leading-10">
                                New Password
                            </Text>
                           
                        </View>

                        <View
                            className="bg-white rounded-[28px] p-7 mb-8"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            <View className="relative mb-4">
                                <TextInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    className="w-full px-4 py-4 border-[1.5px] border-gray-200 rounded-xl text-gray-800 bg-gray-50 pr-12 text-[15px]"
                                    placeholderTextColor="#9CA3AF"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4"
                                    activeOpacity={0.7}
                                >
                                    {showPassword ? (
                                        <Eye size={20} color="#9CA3AF" />
                                    ) : (
                                        <EyeOff size={20} color="#9CA3AF" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View className="relative mb-5">
                                <TextInput
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    className="w-full px-4 py-4 border-[1.5px] border-gray-200 rounded-xl text-gray-800 bg-gray-50 pr-12 text-[15px]"
                                    placeholderTextColor="#9CA3AF"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-4"
                                    activeOpacity={0.7}
                                >
                                    {showConfirmPassword ? (
                                        <Eye size={20} color="#9CA3AF" />
                                    ) : (
                                        <EyeOff size={20} color="#9CA3AF" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={handleContinue}
                                className="w-full py-4 rounded-xl bg-[#122141]"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-center font-bold text-[16px]">
                                    Confirm Password
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
