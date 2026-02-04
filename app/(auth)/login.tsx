import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoogleLogin, useLogin } from '../../hooks/authHooks';

// Google Logo URL
const GOOGLE_LOGO = "https://www.svgrepo.com/show/475656/google-color.svg";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const router = useRouter();

    const { handleGoogleLogin } = useGoogleLogin();
    const { handleLogin, loading } = useLogin();

    const handleSubmit = async () => {
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }
        await handleLogin(email, password);
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />

            {/* Background Image */}
            <Image
                source={require('../assets/images/lvccgate.jpg')}
                className="absolute top-0 left-0 right-0 h-[42%]"
                style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
                resizeMode="cover"
            />

            {/* Dark Overlay for better text readability */}
            <LinearGradient
                colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
                className="absolute top-0 left-0 right-0 h-[42%]"
                style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
            />


            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header Section */}
                        <View className="items-center mt-2 mb-6">
                            {/* Logo */}
                            <View className="p-4">
                                <Image
                                    source={require('../assets/images/psaslogo.png')}
                                    className="w-32 h-32"
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Title */}
                            <Text className="text-[32px] font-bold text-white text-center mb-2 leading-10">
                                Sign in to your{"\n"}Account
                            </Text>

                            {/* Subtitle */}
                            <Text className="text-white/90 text-center text-[15px] mt-1">
                                Enter your email and password to log in
                            </Text>
                        </View>

                        {/* White Card Section */}
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
                            {/* Google Login Button */}
                            <TouchableOpacity
                                onPress={handleGoogleLogin}
                                className="flex-row items-center justify-center py-4 rounded-xl border-[1.5px] border-gray-200 bg-white mb-6"
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: GOOGLE_LOGO }}
                                    className="w-5 h-5 mr-3"
                                    resizeMode="contain"
                                />
                                <Text className="text-gray-800 font-semibold text-[15px]">
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View className="flex-row items-center mb-6">
                                <View className="flex-1 h-[1px] bg-gray-200" />
                                <Text className="mx-4 text-gray-400 text-[13px]">Or login with</Text>
                                <View className="flex-1 h-[1px] bg-gray-200" />
                            </View>

                            {/* Email Input */}
                            <View className="mb-4">
                                <TextInput
                                    placeholder="Loisbecket@gmail.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    className="w-full px-4 py-4 border-[1.5px] border-gray-200 rounded-xl text-gray-800 bg-gray-50 text-[15px]"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                />
                            </View>

                            {/* Password Input */}
                            <View className="relative mb-3">
                                <TextInput
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    className="w-full px-4 py-4 border-[1.5px] border-gray-200 rounded-xl text-gray-800 bg-gray-50 pr-12 text-[15px]"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4"
                                    activeOpacity={0.7}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color="#9CA3AF" />
                                    ) : (
                                        <Eye size={20} color="#9CA3AF" />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Remember Me & Forgot Password */}
                            <View className="flex-row justify-between items-center mb-6 mt-2">
                                <TouchableOpacity
                                    className="flex-row items-center"
                                    onPress={() => setRememberMe(!rememberMe)}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] mr-2 items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                                            }`}
                                    >
                                        {rememberMe && (
                                            <View className="w-2 h-2 bg-white rounded-[2px]" />
                                        )}
                                    </View>
                                    <Text className="text-gray-600 text-[14px]">Remember me</Text>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.7}>
                                    <Text className="text-blue-600 font-semibold text-[14px]">
                                        Forgot Password ?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl mb-6 ${loading ? 'bg-blue-400' : 'bg-blue-600'
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
                                    {loading ? "Logging in..." : "Log In"}
                                </Text>
                            </TouchableOpacity>

                            {/* Sign Up Link */}
                            <View className="flex-row justify-center">
                                <Text className="text-gray-600 text-[14px]">
                                    Don't have an account?{" "}
                                </Text>
                                <Link href="/signup" asChild>
                                    <TouchableOpacity activeOpacity={0.7}>
                                        <Text className="text-blue-600 font-bold text-[14px]">
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}