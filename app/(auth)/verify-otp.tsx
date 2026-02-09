import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
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



type VerificationState = 'idle' | 'error' | 'success' | 'verifying';

export default function VerifyOTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [verificationState, setVerificationState] = useState<VerificationState>('idle');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Refs for input fields
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Animation values
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const successScale = useRef(new Animated.Value(0)).current;

    // Mock user email (in real app, this would come from route params or context)
    const userEmail = "user@example.com";

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    // Handle OTP input change
    const handleOtpChange = (value: string, index: number) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 6 digits are entered
        if (newOtp.every(digit => digit !== '') && index === 5) {
            handleVerify(newOtp.join(''));
        }
    };

    // Handle backspace
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Shake animation for error
    const triggerShakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // Success animation
    const triggerSuccessAnimation = () => {
        Animated.spring(successScale, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
        }).start();
    };

    // Verify OTP
    const handleVerify = async (code: string) => {
        setVerificationState('verifying');

        // Simulate API call
        setTimeout(() => {
            // Mock validation (replace with actual API call)
            if (code === '123456') {
                setVerificationState('success');
                triggerSuccessAnimation();

                // Navigate to next screen after success
                setTimeout(() => {
                    router.push('/(student)/dashboard');
                }, 1500);
            } else {
                setVerificationState('error');
                triggerShakeAnimation();

                // Clear OTP after error
                setTimeout(() => {
                    setOtp(['', '', '', '', '', '']);
                    setVerificationState('idle');
                    inputRefs.current[0]?.focus();
                }, 1000);
            }
        }, 1500);
    };

    // Resend code
    const handleResend = () => {
        if (!canResend) return;

        setResendTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setVerificationState('idle');
        inputRefs.current[0]?.focus();

        // Simulate resend API call
        console.log('Resending OTP...');
    };

    // Get border color based on state
    const getBorderColor = (index: number) => {
        if (verificationState === 'error') return '#DC2626'; // Red
        if (verificationState === 'success') return '#16A34A'; // Green
        if (otp[index]) return '#1A73E8'; // Google Blue
        return '#DADCE0'; // Gray
    };

    return (
        <View className="flex-1 bg-white">
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
                        {/* Header Section */}
                        <View className="items-center mt-12 mb-8">
                            {/* Google Logo */}
                            <View className="mb-8">
                                <Image
                                    source={require('../../assets/images/google.png')}
                                    className="w-16 h-16"
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Title */}
                            <Text className="text-[28px] font-normal text-gray-900 text-center mb-3">
                                Verify your identity
                            </Text>

                            {/* Subtitle */}
                            <Text className="text-[14px] text-gray-600 text-center leading-5 px-4">
                                A 6-digit code was sent to{'\n'}
                                <Text className="font-medium text-gray-900">{userEmail}</Text>
                            </Text>
                        </View>

                        {/* OTP Input Section */}
                        <Animated.View
                            style={{
                                transform: [{ translateX: shakeAnimation }],
                            }}
                            className="mb-6"
                        >
                            <View className="flex-row justify-center gap-3 mb-4">
                                {otp.map((digit, index) => (
                                    <View
                                        key={index}
                                        className="relative"
                                    >
                                        <TextInput
                                            ref={(ref) => {
                                                inputRefs.current[index] = ref;
                                            }}
                                            value={digit}
                                            onChangeText={(value) => handleOtpChange(value, index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            selectTextOnFocus
                                            className="w-12 h-14 text-center text-[24px] font-medium rounded-lg"
                                            style={{
                                                borderWidth: 2,
                                                borderColor: getBorderColor(index),
                                                backgroundColor: verificationState === 'success' ? '#F0FDF4' : '#FFFFFF',
                                                color: '#202124',
                                            }}
                                            editable={verificationState !== 'verifying' && verificationState !== 'success'}
                                        />

                                        {/* Success checkmark overlay */}
                                        {verificationState === 'success' && index === 5 && (
                                            <Animated.View
                                                style={{
                                                    transform: [{ scale: successScale }],
                                                }}
                                                className="absolute inset-0 items-center justify-center"
                                            >
                                                <View className="w-12 h-14 items-center justify-center bg-green-50 rounded-lg">
                                                    <Check size={24} color="#16A34A" strokeWidth={3} />
                                                </View>
                                            </Animated.View>
                                        )}
                                    </View>
                                ))}
                            </View>

                            {/* Error Message */}
                            {verificationState === 'error' && (
                                <Text className="text-center text-[13px] text-red-600 mb-2">
                                    Invalid code. Please try again.
                                </Text>
                            )}

                            {/* Success Message */}
                            {verificationState === 'success' && (
                                <Text className="text-center text-[13px] text-green-600 mb-2 font-medium">
                                    Verification successful!
                                </Text>
                            )}

                            {/* Verifying Message */}
                            {verificationState === 'verifying' && (
                                <Text className="text-center text-[13px] text-gray-600 mb-2">
                                    Verifying...
                                </Text>
                            )}
                        </Animated.View>

                        {/* Resend Section */}
                        <View className="items-center mt-8">
                            <TouchableOpacity
                                onPress={handleResend}
                                disabled={!canResend}
                                activeOpacity={0.7}
                                className="mb-4"
                            >
                                <Text
                                    className={`text-[14px] font-medium ${canResend ? 'text-blue-600' : 'text-gray-400'
                                        }`}
                                >
                                    {canResend ? 'Resend code' : `Resend code in ${resendTimer}s`}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.back()}
                                activeOpacity={0.7}
                            >
                                <Text className="text-[14px] text-blue-600 font-medium">
                                    Try another way
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Helper Text */}
                        <View className="mt-auto mb-8">
                            <Text className="text-center text-[12px] text-gray-500 leading-5 px-8">
                                Check your spam folder if you don't see the code in your inbox
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
