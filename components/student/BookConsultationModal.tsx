import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookConsultationModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
}

export default function BookConsultationModal({ visible, onClose, onSubmit }: BookConsultationModalProps) {
    const [form, setForm] = useState({
        office_id: '',
        service_type: '',
        date: '',
        time: '',
        concern_description: '',
        group_members: '',
    });

    // Mock Options
    const OFFICE_OPTIONS = [
        { id: '1', name: 'Guidance Office' },
        { id: '2', name: 'Student Affairs' },
        { id: '3', name: 'Registrar' },
    ];

    const SERVICE_TYPE_OPTIONS = ['Consultation', 'Therapy', 'Assessment', 'Advisory'];

    // Helper to generic Input
    const renderLabel = (text: string, required = false) => (
        <Text className="text-black text-sm font-semibold mb-1" style={{ fontFamily: 'Inter-SemiBold' }}>
            {text} {required && <Text className="text-red-500">*</Text>}
        </Text>
    );

    const handleSubmit = () => {
        // Basic validation
        if (!form.office_id || !form.service_type || !form.date || !form.time || !form.concern_description) {
            alert('Please fill in all required fields');
            return;
        }
        onSubmit(form);
        onClose();
        // Reset form?
        setForm({
            office_id: '',
            service_type: '',
            date: '',
            time: '',
            concern_description: '',
            group_members: '',
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="w-full max-h-[90%]"
                >
                    <View className="bg-white rounded-xl shadow-xl w-full flex-col max-h-full">

                        {/* Header */}
                        <View className="bg-[#122141] rounded-t-xl px-6 py-4 flex-row justify-between items-center">
                            <Text className="text-white text-lg font-bold" style={{ fontFamily: 'Inter-Bold' }}>
                                Book a Consultation
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 20 }}>

                            {/* Office Select (Simplified as Row of Buttons or just simple text for MVP if list is long, using buttons for now) */}
                            <View className="mb-4">
                                {renderLabel('Office', true)}
                                <View className="border border-[#9B9999] rounded-lg overflow-hidden bg-[#FFFCFC]">
                                    {OFFICE_OPTIONS.map((office) => (
                                        <TouchableOpacity
                                            key={office.id}
                                            className={`p-3 border-b border-gray-100 ${form.office_id === office.id ? 'bg-blue-50' : 'bg-white'}`}
                                            onPress={() => setForm({ ...form, office_id: office.id })}
                                        >
                                            <Text className={`${form.office_id === office.id ? 'text-[#155DFC] font-semibold' : 'text-black'}`}>
                                                {office.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Service Type */}
                            <View className="mb-4">
                                {renderLabel('Type of Service', true)}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                    {SERVICE_TYPE_OPTIONS.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            className={`px-4 py-2 rounded-full border ${form.service_type === type ? 'bg-[#155DFC] border-[#155DFC]' : 'bg-white border-[#9B9999]'}`}
                                            onPress={() => setForm({ ...form, service_type: type })}
                                        >
                                            <Text className={`text-xs ${form.service_type === type ? 'text-white' : 'text-gray-700'}`}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Date & Time Row */}
                            <View className="flex-row gap-4 mb-4">
                                <View className="flex-1">
                                    {renderLabel('Date', true)}
                                    <TextInput
                                        className="w-full h-10 px-3 border border-[#9B9999] rounded-lg bg-white text-sm"
                                        placeholder="YYYY-MM-DD"
                                        value={form.date}
                                        onChangeText={(text) => setForm({ ...form, date: text })}
                                    />
                                </View>
                                <View className="flex-1">
                                    {renderLabel('Time', true)}
                                    <TextInput
                                        className="w-full h-10 px-3 border border-[#9B9999] rounded-lg bg-white text-sm"
                                        placeholder="HH:MM"
                                        value={form.time}
                                        onChangeText={(text) => setForm({ ...form, time: text })}
                                    />
                                </View>
                            </View>

                            {/* Concern Description */}
                            <View className="mb-4">
                                {renderLabel('Concern Description', true)}
                                <TextInput
                                    className="w-full px-3 py-2 border border-[#9B9999] rounded-lg bg-[#FFFCFC] text-sm text-black"
                                    placeholder="Briefly describe your concern"
                                    multiline
                                    numberOfLines={4}
                                    style={{ height: 100, textAlignVertical: 'top' }}
                                    value={form.concern_description}
                                    onChangeText={(text) => setForm({ ...form, concern_description: text })}
                                />
                            </View>

                            {/* Group Members */}
                            <View className="mb-4">
                                {renderLabel('Group Members (Optional)')}
                                <TextInput
                                    className="w-full px-3 py-2 border border-[#9B9999] rounded-lg bg-[#FFFCFC] text-sm text-black"
                                    placeholder="Enter names"
                                    multiline
                                    numberOfLines={2}
                                    style={{ height: 60, textAlignVertical: 'top' }}
                                    value={form.group_members}
                                    onChangeText={(text) => setForm({ ...form, group_members: text })}
                                />
                            </View>

                            {/* Attachment (Placeholder) */}
                            <View className="mb-6">
                                {renderLabel('Attachment (Optional)')}
                                <TouchableOpacity className="w-full h-10 border border-[#9B9999] rounded-lg bg-[#FFFCFC] items-center justify-center flex-row gap-2">
                                    <Ionicons name="cloud-upload-outline" size={20} color="#666" />
                                    <Text className="text-gray-500 text-sm">Upload File (Image)</Text>
                                </TouchableOpacity>
                                <Text className="text-gray-400 text-xs mt-1 italic">We only accept png, jpeg and jpg for now</Text>
                            </View>

                            {/* Buttons */}
                            <View className="flex-row justify-end gap-3 pt-2">
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="px-4 py-2 rounded-lg border border-black bg-white"
                                >
                                    <Text className="text-black text-xs font-medium">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="px-4 py-2 rounded-lg bg-[#155DFC]"
                                >
                                    <Text className="text-white text-xs font-medium">Submit Request</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
