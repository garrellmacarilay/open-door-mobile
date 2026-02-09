import { Tabs } from 'expo-router';
import StudentTabBar from '../../components/nav/StudentTabBar';

export default function StudentLayout() {
    return (
        <Tabs
            tabBar={(props) => <StudentTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
            <Tabs.Screen name="consultation" options={{ title: 'Booking' }} />
            <Tabs.Screen name="history" options={{ title: 'History' }} />
            <Tabs.Screen name="faqs" options={{ title: 'FAQs' }} />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    href: null // Hide from tab bar, accessed via header button
                }}
            />
        </Tabs>
    );
}
