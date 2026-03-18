import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#18233D]">
            <View className="flex-1 items-center justify-center px-6">
                <Text className="text-white text-3xl font-bold mb-2">Admin Module</Text>
                <Text className="text-white/60 text-base text-center mb-10">
                    Admin dashboard coming soon.
                </Text>
                <TouchableOpacity
                    onPress={() => router.replace('/(auth)/login')}
                    className="bg-white/10 border border-white/20 px-8 py-3 rounded-xl"
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-semibold text-[15px]">Back to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
