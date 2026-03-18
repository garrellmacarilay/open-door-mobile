import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StaffTabBar from '../../components/nav/StaffTabBar';
import DashboardHeader from '../../components/student/DashboardHeader';

export default function StaffLayout() {
    return (
        <SafeAreaView className="flex-1 bg-[#18233D]" edges={['top', 'left', 'right']}>
            <DashboardHeader
                user={{ name: "Staff Member", email: "office@example.com" }}
                onProfilePress={() => {}}
                onNotificationPress={() => {}}
            />
            <View className="flex-1 bg-gray-50">
                <Tabs
                    tabBar={(props) => <StaffTabBar {...props} />}
                    screenOptions={{ headerShown: false }}
                >
                    <Tabs.Screen name="index" options={{ href: null }} />
                    <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
                    <Tabs.Screen name="history" options={{ title: 'History' }} />
                    <Tabs.Screen name="faqs" options={{ title: 'FAQs' }} />
                </Tabs>
            </View>
        </SafeAreaView>
    );
}
