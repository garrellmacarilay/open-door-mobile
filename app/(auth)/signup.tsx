
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoogleLogin } from '../../hooks/authHooks';



export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const { handleGoogleLogin } = useGoogleLogin();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            alert("Please fill in all fields");
            return;
        }
        alert("Signup logic would go here!");
    };

    return (
        <View className="flex-1 bg-white">
            {/* Background Image */}
            <Image
                source={require('../../assets/images/lvccgate.jpg')}
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
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        className="px-6"
                    >
                        {/* Header Section */}
                        <View className="items-center mt-2 mb-6">
                            <View className="p-4">
                                <Image
                                    source={require('../../assets/images/psaslogo.png')}
                                    className="w-32 h-32"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-3xl font-bold text-white text-center mb-2">
                                Create an{"\n"}Account
                            </Text>
                            <Text className="text-blue-100 text-center text-sm">
                                Sign up to get started
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

                            {/* Form Inputs */}
                            <View className="space-y-4 gap-4">
                                <View>
                                    <TextInput
                                        placeholder="Full Name"
                                        value={name}
                                        onChangeText={setName}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 bg-gray-50 focus:border-blue-500 focus:bg-white"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>

                                <View>
                                    <TextInput
                                        placeholder="Email Address"
                                        value={email}
                                        onChangeText={setEmail}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 bg-gray-50 focus:border-blue-500 focus:bg-white"
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
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 bg-gray-50 focus:border-blue-500 focus:bg-white pr-12"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5"
                                    >
                                        {showPassword ?
                                            <EyeOff size={22} color="#9CA3AF" /> :
                                            <Eye size={22} color="#9CA3AF" />
                                        }
                                    </TouchableOpacity>
                                </View>

                                {/* Terms Checkbox (Optional but good for signup) */}
                                <View className="flex-row items-start gap-2 mt-1">
                                    <View className="w-5 h-5 rounded border border-blue-600 bg-blue-600 items-center justify-center mt-0.5">
                                        <View className="w-2.5 h-2.5 bg-white rounded-sm" />
                                    </View>
                                    <Text className="text-gray-500 text-xs flex-1">
                                        By signing up, you agree to our <Text className="text-blue-600 font-semibold">Terms of Service</Text> and <Text className="text-blue-600 font-semibold">Privacy Policy</Text>.
                                    </Text>
                                </View>

                                {/* Signup Button */}
                                <TouchableOpacity
                                    onPress={handleSignup}
                                    className="w-full bg-blue-600 py-4 rounded-xl shadow-lg shadow-blue-600/30 active:bg-blue-700 mt-2"
                                >
                                    <Text className="text-white text-center font-bold text-lg">
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            {/* Divider */}
                            <View className="flex-row items-center my-6">
                                <View className="flex-1 h-[1px] bg-gray-200" />
                                <Text className="mx-4 text-gray-400 text-sm">Or sign up with</Text>
                                <View className="flex-1 h-[1px] bg-gray-200" />
                            </View>

                            {/* Google Signup */}
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/verify-otp')}
                                className="flex-row items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white active:bg-gray-50"
                            >
                                <Image
                                    source={require('../../assets/images/google.png')}
                                    className="w-5 h-5"
                                    resizeMode="contain"
                                />
                                <Text className="text-gray-700 font-semibold text-base">Continue with Google</Text>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <View className="flex-row justify-center mt-8">
                                <Text className="text-gray-500">Already have an account? </Text>
                                <Link href="/login" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-blue-600 font-bold">Log In</Text>
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
