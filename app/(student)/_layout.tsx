import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudentTabBar from '../../components/nav/StudentTabBar';
import DashboardHeader from '../../components/student/DashboardHeader';

export default function StudentLayout() {
    return (
        <SafeAreaView className="flex-1 bg-[#18233D]" edges={['top', 'left', 'right']}>
            <DashboardHeader user={{ name: "Garrell Macarilay", email: "student@example.com" }} />
            <View className="flex-1 bg-gray-50">
                <Tabs
                    tabBar={(props) => <StudentTabBar {...props} />}
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
                    <Tabs.Screen name="history" options={{ title: 'History' }} />
                    <Tabs.Screen name="faqs" options={{ title: 'FAQs' }} />
                </Tabs>
            </View>
        </SafeAreaView>
    );
}
