import { View, Text, SafeAreaView } from 'react-native';

export default function FAQs() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center pt-12">
            <Text className="text-xl font-semibold text-gray-800">FAQs</Text>
            <Text className="text-gray-500 mt-2">Frequently Asked Questions</Text>
        </SafeAreaView>
    );
}
