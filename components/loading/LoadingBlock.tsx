import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export default function LoadingBlock({ height = 160 }: { height?: number }) {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const opacity = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 1],
    });

    return (
        <View style={{ height }} className="w-full bg-gray-200 rounded-xl overflow-hidden mb-3">
            <Animated.View style={{ opacity }} className="absolute inset-0 bg-gray-300 w-full h-full" />
        </View>
    );
}