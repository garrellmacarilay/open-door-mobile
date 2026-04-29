import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PasswordChangedPage() {
    const router = useRouter();

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
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center' }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            className="bg-white rounded-[28px] p-7 mb-8 items-center"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.08,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            <View className="w-24 h-24 rounded-full border-2 border-[#22A06B] items-center justify-center mb-6">
                                <Check size={48} color="#22A06B" />
                            </View>

                            <Text className="text-[30px] font-bold text-[#1F2937] text-center mb-2">
                                Password Changed
                            </Text>
                            <Text className="text-[14px] text-gray-500 text-center mb-8">
                                Your password has been changed successfully.
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.replace('/(auth)/login')}
                                className="w-full py-4 rounded-xl bg-[#122141]"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white text-center font-bold text-[16px]">
                                    Sign In Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
