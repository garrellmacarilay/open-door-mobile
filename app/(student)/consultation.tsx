import { View, Text, SafeAreaView } from 'react-native';

export default function BookConsultation() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
            <Text className="text-xl font-semibold text-gray-800">Booking Consultation</Text>
            <Text className="text-gray-500 mt-2">Book a new consultation here</Text>
        </SafeAreaView>
    );
}
