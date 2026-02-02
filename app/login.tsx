
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoogleLogin, useLogin } from '../hooks/authHooks';

// Placeholder assets for visuals - In a real app these should be local assets
const Login_img = { uri: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" }; // College-like building
const PSAS_Logo = { uri: "https://img.icons8.com/deco/200/228BE6/university.png" }; // Generic University Logo

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const { handleGoogleLogin } = useGoogleLogin();
    const { handleLogin, loading, message } = useLogin();

    const handleSubmit = async () => {
        // Basic validation
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }

        await handleLogin(email, password);
    };

    const handleBackClick = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    };

    return (
        <LinearGradient
            colors={['#122141', '#0B1426']}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
                    <View className="flex-1 items-center justify-center p-4">

                        {/* Main Card */}
                        <View className="flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl elevation-10">

                            {/* Left - Login Form */}
                            <View className="w-full md:w-1/2 p-8 pt-6 relative flex-col justify-center bg-white z-10">
                                {/* Back Arrow */}
                                <TouchableOpacity
                                    onPress={handleBackClick}
                                    className="absolute top-6 left-6 bg-gray-50 p-2 rounded-full active:bg-gray-200 z-50 elevation-2"
                                >
                                    <ArrowLeft size={24} color="#000" />
                                </TouchableOpacity>

                                {/* Logo */}
                                <View className="items-center mt-12 mb-8">
                                    <Image
                                        source={PSAS_Logo}
                                        className="w-40 h-40"
                                        resizeMode="contain"
                                    />
                                    {/* Optional Title if needed */}
                                    {/* <Text className="text-2xl font-bold text-blue-900 mt-2">Welcome Back!</Text> */}
                                </View>

                                <View className="flex-col gap-4 mt-2">
                                    <View>
                                        <TextInput
                                            placeholder="Email Address"
                                            value={email}
                                            onChangeText={setEmail}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:border-blue-800 bg-gray-50"
                                            placeholderTextColor="#9CA3AF"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>
                                    <View className="relative">
                                        <TextInput
                                            placeholder="Password"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:border-blue-800 bg-gray-50 pr-12"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3.5"
                                        >
                                            {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="w-full bg-[#1e3a8a] py-3.5 rounded-md shadow-md active:bg-[#1e40af] mt-2"
                                    >
                                        <Text className="text-white text-center font-semibold text-lg">
                                            {loading ? "Logging in..." : "Log In"}
                                        </Text>
                                    </TouchableOpacity>

                                    <View className="flex-row items-center my-4">
                                        <View className="flex-1 h-[1px] bg-gray-300"></View>
                                        <Text className="mx-2 text-gray-500 text-sm">or</Text>
                                        <View className="flex-1 h-[1px] bg-gray-300"></View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleGoogleLogin}
                                        className="flex-row items-center justify-center gap-2 py-3 rounded-md border border-gray-300 bg-white active:bg-gray-50 mb-2"
                                    >
                                        <Image
                                            source={{ uri: "https://www.svgrepo.com/show/475656/google-color.svg" }}
                                            className="w-5 h-5"
                                            resizeMode="contain"
                                        />
                                        <Text className="text-black font-medium">Sign in with Google</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Right - Image (Visible on larger screens, helps on mobile if we want) */}
                            {/* For mobile Flex-col means this block comes AFTER the form. It mimics the design. */}
                            {/* Added h-48 for mobile visibility, md:h-auto for full height on desktop */}
                            <View className="w-full md:w-1/2 h-48 md:h-auto bg-[#122141]">
                                <Image
                                    source={Login_img}
                                    className="w-full h-full opacity-90"
                                    resizeMode="cover"
                                />
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}
