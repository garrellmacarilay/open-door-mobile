import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, FileClock, Building2, BarChart3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ICONS: Record<string, React.ElementType> = {
    dashboard: LayoutDashboard,
    history: FileClock,
    offices: Building2,
    analytics: BarChart3,
};

export default function AdminTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View className="absolute bottom-8 left-0 right-0 items-center justify-center">
            <View
                className="flex-row items-center justify-between rounded-full shadow-lg px-6 py-4 bg-[#142240]"
                style={{
                    width: width * 0.85,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                {state.routes
                    .filter((route) => Object.keys(ICONS).includes(route.name))
                    .map((route) => {
                        const isFocused = state.index === state.routes.findIndex((r) => r.key === route.key);

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
                                className="items-center justify-center flex-1"
                            >
                                <View
                                    className={`items-center justify-center ${
                                        isFocused ? 'bg-[#7C3AED]' : 'bg-transparent'
                                    }`}
                                    style={{ width: 50, height: 50, borderRadius: 25 }}
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
