
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PSAS_Logo = { uri: "https://img.icons8.com/deco/200/228BE6/university.png" };

export default function LandingPage() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={['#122141', '#0B1426']}
            className="flex-1"
        >
            <SafeAreaView className="flex-1 justify-between items-center py-12 px-6">

                {/* Header / Logo Area */}
                <View className="items-center mt-10">
                    <View className="bg-white/10 p-6 rounded-full mb-6">
                        <Image
                            source={PSAS_Logo}
                            className="w-32 h-32"
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="text-4xl font-bold text-white text-center tracking-wider">
                        Open Door
                    </Text>
                    <Text className="text-blue-200 text-lg mt-2 text-center font-medium">
                        Your Digital Campus Companion
                    </Text>
                </View>

                {/* Middle Content */}
                <View className="items-center">
                    <Text className="text-gray-400 text-center px-4 leading-6">
                        Seamlessly access your school portal, track attendance, and stay updated with the latest announcements.
                    </Text>
                </View>

                {/* Action Area */}
                <View className="w-full gap-4 mb-8">
                    <TouchableOpacity
                        onPress={() => router.push('/login')}
                        className="bg-[#228BE6] w-full py-4 rounded-xl flex-row justify-center items-center shadow-lg active:bg-[#1c7ed6]"
                    >
                        <Text className="text-white font-bold text-lg mr-2">Get Started</Text>
                        <ArrowRight size={20} color="white" />
                    </TouchableOpacity>

                    {/* Optional Secondary Button (e.g. Learn More or Sign Up) */}
                    {/* <TouchableOpacity
                        className="bg-transparent border border-white/20 w-full py-4 rounded-xl flex-row justify-center items-center active:bg-white/5"
                    >
                        <Text className="text-white font-semibold text-lg">Learn More</Text>
                    </TouchableOpacity> */}
                </View>

            </SafeAreaView>
        </LinearGradient>
    );
}
