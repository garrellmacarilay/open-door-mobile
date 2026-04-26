import { useEffect, useRef } from 'react';
import { Animated, View, StatusBar, StyleSheet } from 'react-native';

function ProgressBar() {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: false,
        }).start();
    }, []);

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View
            style={{
                width: 120,
                height: 22,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#3B82F6',
                overflow: 'hidden',
            }}
        >
            <Animated.View
                style={{
                    width,
                    height: '100%',
                    backgroundColor: '#3B82F6',
                    margin: 2,
                    borderRadius: 20,
                }}
            />
        </View>
    );
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const fadeOut = useRef(new Animated.Value(1)).current;
    const slideOut = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeOut, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideOut, {
                        toValue: -40,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]).start(onFinish);
            }, 1000);
        });
    }, []);

    return (
        <Animated.View
            style={{
                opacity: fadeOut,
                transform: [{ translateX: slideOut }],
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <StatusBar barStyle="light-content" />

            {/* Background image — top 52% */}
            <Animated.Image
                source={require('../../assets/images/lvccgate.jpg')}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '52%',
                    width: '100%',
                    opacity,
                }}
                resizeMode="cover"
            />

            {/* Bottom panel with top rounded corners + blur */}
            <Animated.View
                style={{
                    opacity,
                    position: 'absolute',
                    top: '52%',         // overlaps image slightly
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                }}
            >
                {/* Progress bar inside the panel */}
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingTop: 36,
                    }}
                >
                    <ProgressBar />
                </View>
            </Animated.View>
        </Animated.View>
    );
}