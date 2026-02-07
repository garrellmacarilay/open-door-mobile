import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Calendar, FileClock, CircleHelp } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Define icons map
const ICONS: Record<string, React.ElementType> = {
    dashboard: LayoutDashboard,
    consultation: Calendar,
    history: FileClock,
    faqs: CircleHelp,
};

export default function StudentTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View className="absolute bottom-8 left-0 right-0 items-center justify-center">
            <View
                className="flex-row items-center justify-between rounded-full shadow-lg px-6 py-4"
                style={{
                    width: width * 0.85,
                    backgroundColor: '#142240', // Updated to match Upcoming Appointment Header
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const IconComponent = ICONS[route.name] || LayoutDashboard;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            className="items-center justify-center"
                        >
                            <View
                                className={`p-3 rounded-full items-center justify-center`}
                                style={{
                                    backgroundColor: isFocused ? '#5B21B6' : 'transparent', // Circle effect when clicked
                                    width: 50,
                                    height: 50,
                                }}
                            >
                                <IconComponent
                                    size={24}
                                    color={isFocused ? 'white' : '#9CA3AF'}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
