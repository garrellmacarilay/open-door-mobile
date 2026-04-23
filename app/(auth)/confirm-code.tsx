import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
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

export default function ConfirmCodePage() {
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email?: string }>();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleCodeChange = (value: string, index: number) => {
        if (value && !/^\d+$/.test(value)) return;

        const next = [...code];
        next[index] = value;
        setCode(next);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleContinue = () => {
        if (code.some((digit) => !digit)) {
            alert('Please enter the 6-digit code');
            return;
        }

        router.push({
            pathname: '/(auth)/reset-password',
            params: { email: email || '' },
        });
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

                            <Text className="text-[30px] font-bold text-white text-center mb-2 leading-10">
                                Verify Email Address
                            </Text>
                            <Text className="text-[14px] text-white/90 text-center px-5">
                                Verification code sent to {email || 'your email'}
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
                            <View className="flex-row justify-between mb-6">
                                {code.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => {
                                            inputRefs.current[index] = ref;
                                        }}
                                        value={digit}
                                        onChangeText={(value) => handleCodeChange(value, index)}
                                        onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        className="w-[15%] h-14 text-center text-[22px] font-bold border-[1.5px] border-gray-200 rounded-xl text-gray-800 bg-gray-50"
                                    />
                                ))}
                            </View>

                            <TouchableOpacity
                                onPress={handleContinue}
                                className="w-full py-4 rounded-xl bg-[#122141]"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-center font-bold text-[16px]">
                                    Confirm Code
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
