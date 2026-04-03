import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { House, CalendarDays, CircleHelp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Define icons map
const ICONS: Record<string, React.ElementType> = {
    dashboard: House,
    history: CalendarDays,
    faqs: CircleHelp,
};

export default function StudentTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
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
                    .filter(route => Object.keys(ICONS).includes(route.name))
                    .map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

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

                        const IconComponent = ICONS[route.name] || House;
                        const label = options.title ?? route.name;

                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                activeOpacity={0.7}
                                className="items-center justify-center flex-1"
                            >
                                <View className="items-center justify-center" style={{ width: 50, height: 50 }}>
                                    <IconComponent
                                        size={24}
                                        color={isFocused ? '#4A90E2' : '#9CA3AF'}
                                        strokeWidth={isFocused ? 2.5 : 1.8}
                                    />
                                </View>
                                {isFocused && (
                                    <Text style={{ color: '#4A90E2', fontSize: 11, fontWeight: '600', marginTop: -4 }}>
                                        {label}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
            </View>
        </View>
    );
}
