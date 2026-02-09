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
        <Text className="text-white text-sm font-semibold mb-2" style={{ fontFamily: 'Inter-SemiBold' }}>
            {text} {required && <Text className="text-red-400">*</Text>}
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
            <View className="flex-1 bg-[#142240]">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-1 pt-12">
                        {/* Header */}
                        <View className="px-6 py-5 flex-row justify-between items-center border-b border-white/10">
                            <Text className="text-white text-2xl font-bold" style={{ fontFamily: 'Inter-Bold' }}>
                                Book a Consultation
                            </Text>
                            <TouchableOpacity
                                onPress={onClose}
                                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        <ScrollView
                            className="flex-1 px-6"
                            contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
                            showsVerticalScrollIndicator={false}
                        >

                            {/* Office Select */}
                            <View className="mb-6">
                                {renderLabel('Office', true)}
                                <View className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                    {OFFICE_OPTIONS.map((office, index) => (
                                        <TouchableOpacity
                                            key={office.id}
                                            className={`p-4 ${index !== OFFICE_OPTIONS.length - 1 ? 'border-b border-white/10' : ''} ${form.office_id === office.id ? 'bg-[#5B21B6]' : 'bg-transparent'}`}
                                            onPress={() => setForm({ ...form, office_id: office.id })}
                                        >
                                            <Text className={`text-base ${form.office_id === office.id ? 'text-white font-semibold' : 'text-white/70'}`}>
                                                {office.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Service Type */}
                            <View className="mb-6">
                                {renderLabel('Type of Service', true)}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                                    {SERVICE_TYPE_OPTIONS.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            className={`px-6 py-3 rounded-full ${form.service_type === type ? 'bg-[#5B21B6]' : 'bg-white/5 border border-white/20'}`}
                                            onPress={() => setForm({ ...form, service_type: type })}
                                        >
                                            <Text className={`text-sm font-medium ${form.service_type === type ? 'text-white' : 'text-white/70'}`}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Date & Time Row */}
                            <View className="flex-row gap-4 mb-6">
                                <View className="flex-1">
                                    {renderLabel('Date', true)}
                                    <TextInput
                                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/20 text-white text-base"
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        value={form.date}
                                        onChangeText={(text) => setForm({ ...form, date: text })}
                                    />
                                </View>
                                <View className="flex-1">
                                    {renderLabel('Time', true)}
                                    <TextInput
                                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/20 text-white text-base"
                                        placeholder="HH:MM"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        value={form.time}
                                        onChangeText={(text) => setForm({ ...form, time: text })}
                                    />
                                </View>
                            </View>

                            {/* Concern Description */}
                            <View className="mb-6">
                                {renderLabel('Concern Description', true)}
                                <TextInput
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-base"
                                    placeholder="Briefly describe your concern"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    multiline
                                    numberOfLines={4}
                                    style={{ height: 120, textAlignVertical: 'top' }}
                                    value={form.concern_description}
                                    onChangeText={(text) => setForm({ ...form, concern_description: text })}
                                />
                            </View>

                            {/* Group Members */}
                            <View className="mb-6">
                                {renderLabel('Group Members (Optional)')}
                                <TextInput
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-base"
                                    placeholder="Enter names"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    multiline
                                    numberOfLines={2}
                                    style={{ height: 80, textAlignVertical: 'top' }}
                                    value={form.group_members}
                                    onChangeText={(text) => setForm({ ...form, group_members: text })}
                                />
                            </View>

                            {/* Attachment */}
                            <View className="mb-8">
                                {renderLabel('Attachment (Optional)')}
                                <TouchableOpacity className="w-full h-14 rounded-xl bg-white/5 border border-white/20 items-center justify-center flex-row gap-3">
                                    <Ionicons name="cloud-upload-outline" size={24} color="rgba(255,255,255,0.7)" />
                                    <Text className="text-white/70 text-base">Upload File (Image)</Text>
                                </TouchableOpacity>
                                <Text className="text-white/40 text-xs mt-2 italic">We only accept png, jpeg and jpg for now</Text>
                            </View>

                            {/* Buttons */}
                            <View className="flex-row gap-4">
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="flex-1 h-14 rounded-xl border-2 border-white/20 bg-transparent items-center justify-center"
                                >
                                    <Text className="text-white text-base font-semibold">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="flex-1 h-14 rounded-xl bg-[#5B21B6] items-center justify-center"
                                    style={{
                                        shadowColor: '#5B21B6',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    }}
                                >
                                    <Text className="text-white text-base font-bold">Submit Request</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
