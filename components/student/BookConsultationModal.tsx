import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, FlatList, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookConsultationModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
}

// 10 offices from contactInfo in Landingpage.jsx
const OFFICE_OPTIONS = [
    { id: '1', label: 'Prefect and Assistant Prefect' },
    { id: '2', label: 'Guidance' },
    { id: '3', label: 'Medical Clinic' },
    { id: '4', label: 'Sports Development and Management' },
    { id: '5', label: 'Student Assistance and Experiential Learning' },
    { id: '6', label: 'Student Discipline' },
    { id: '7', label: 'Student Internship' },
    { id: '8', label: 'IT Support Services' },
    { id: '9', label: 'Student Organizations' },
    { id: '10', label: 'Student Publications' },
];

export default function BookConsultationModal({ visible, onClose, onSubmit }: BookConsultationModalProps) {
    const [form, setForm] = useState({
        office: '',
        date: '',
        time: '',
        topic: '',
        group_members: '',
    });
    const [showOfficePicker, setShowOfficePicker] = useState(false);

    // Helper for labels
    const renderLabel = (text: string, required = false) => (
        <Text className="text-[#1F2937] text-[13px] font-bold mb-2 ml-1" style={{ fontFamily: 'Inter-SemiBold' }}>
            {text} {required && <Text className="text-red-500">*</Text>}
        </Text>
    );

    const handleSubmit = () => {
        if (!form.office || !form.date || !form.time || !form.topic) {
            alert('Please fill in all required fields');
            return;
        }
        onSubmit(form);
        onClose();
        setForm({ office: '', date: '', time: '', topic: '', group_members: '' });
    };

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View className="flex-1 bg-black/40 justify-center items-center py-10 px-4">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        className="w-full max-w-sm"
                    >
                        <View className="bg-white rounded-[24px] w-full overflow-hidden shadow-lg">

                            {/* Header */}
                            <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
                                <Text className="text-[#1C274C] text-[20px] font-extrabold" style={{ fontFamily: 'Poppins-Bold' }}>
                                    Book an Appointment
                                </Text>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="w-8 h-8 items-center justify-center rounded-full bg-gray-50"
                                    activeOpacity={0.6}
                                >
                                    <Ionicons name="close" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                className="w-full"
                                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                            >

                                {/* Office Selector */}
                                <View className="mb-4">
                                    {renderLabel('Office', true)}
                                    <TouchableOpacity
                                        className={`w-full h-[46px] border rounded-[10px] px-3 flex-row items-center justify-between bg-white ${form.office ? 'border-[#1D4ED8]' : 'border-gray-200'}`}
                                        activeOpacity={0.7}
                                        onPress={() => setShowOfficePicker(true)}
                                    >
                                        <Text
                                            className={`flex-1 text-[14px] ${form.office ? 'text-[#1C274C] font-semibold' : 'text-gray-400'}`}
                                            numberOfLines={1}
                                        >
                                            {form.office || 'Select Office'}
                                        </Text>
                                        <Ionicons
                                            name="chevron-down"
                                            size={18}
                                            color={form.office ? '#1D4ED8' : '#9CA3AF'}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Date & Time Row */}
                                <View className="flex-row gap-3 mb-4">
                                    <View className="flex-1">
                                        {renderLabel('Date', true)}
                                        <View className="w-full h-[46px] border border-gray-200 rounded-[10px] px-3 flex-row items-center justify-between bg-white">
                                            <TextInput
                                                className="flex-1 text-[#1F2937] text-[14px]"
                                                placeholder="mm/dd/yyyy"
                                                placeholderTextColor="#9CA3AF"
                                                value={form.date}
                                                onChangeText={(text) => setForm({ ...form, date: text })}
                                            />
                                            <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        {renderLabel('Time', true)}
                                        <View className="w-full h-[46px] border border-gray-200 rounded-[10px] px-3 flex-row items-center justify-between bg-white">
                                            <TextInput
                                                className="flex-1 text-[#1F2937] text-[14px]"
                                                placeholder="Ex. 8:00 AM"
                                                placeholderTextColor="#9CA3AF"
                                                value={form.time}
                                                onChangeText={(text) => setForm({ ...form, time: text })}
                                            />
                                            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                                        </View>
                                    </View>
                                </View>

                                {/* Topic / Purpose */}
                                <View className="mb-4">
                                    {renderLabel('Topic/Purpose', true)}
                                    <TextInput
                                        className="w-full border border-gray-200 rounded-[10px] px-3 py-3 text-[#1F2937] text-[14px] bg-white"
                                        placeholder="Provide a brief overview of your concern..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        numberOfLines={4}
                                        style={{ height: 100, textAlignVertical: 'top' }}
                                        value={form.topic}
                                        onChangeText={(text) => setForm({ ...form, topic: text })}
                                    />
                                </View>

                                {/* Group Members */}
                                <View className="mb-4">
                                    {renderLabel('Group Members (Optional)')}
                                    <TextInput
                                        className="w-full h-[46px] border border-gray-200 rounded-[10px] px-3 text-[#1F2937] text-[14px] bg-white"
                                        placeholder="e.g. Garrell, Marga"
                                        placeholderTextColor="#9CA3AF"
                                        value={form.group_members}
                                        onChangeText={(text) => setForm({ ...form, group_members: text })}
                                    />
                                </View>

                                {/* Attachment */}
                                <View className="mb-8">
                                    {renderLabel('Attachment (Optional)')}
                                    <TouchableOpacity
                                        className="w-full border border-gray-200 rounded-[10px] items-center justify-center py-6 bg-white"
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="cloud-upload-outline" size={28} color="#3B82F6" />
                                        <Text className="text-gray-400 text-[12px] font-medium mt-2 mb-1">
                                            PDF, JPG, PNG (Max 5 MB)
                                        </Text>
                                        <Text className="text-[#3B82F6] text-[13px] font-semibold">
                                            Browse File
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Book Button */}
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="w-full h-[50px] bg-[#18233D] rounded-[10px] items-center justify-center mt-2"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white text-[16px] font-bold" style={{ fontFamily: 'Poppins-Bold' }}>
                                        Book
                                    </Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Office Picker Bottom Sheet */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showOfficePicker}
                onRequestClose={() => setShowOfficePicker(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/40 justify-end"
                    activeOpacity={1}
                    onPress={() => setShowOfficePicker(false)}
                >
                    <View className="bg-white rounded-t-[28px] pb-10 pt-4">
                        {/* Handle bar */}
                        <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-4" />

                        {/* Sheet Header */}
                        <View className="flex-row items-center justify-between px-6 mb-4">
                            <Text className="text-[#1C274C] text-[18px] font-extrabold">Select Office</Text>
                            <TouchableOpacity onPress={() => setShowOfficePicker(false)} activeOpacity={0.6}>
                                <Ionicons name="close" size={22} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Office List */}
                        <FlatList
                            data={OFFICE_OPTIONS}
                            keyExtractor={(item) => item.id}
                            style={{ maxHeight: 400 }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const isSelected = form.office === item.label;
                                return (
                                    <TouchableOpacity
                                        className={`flex-row items-center justify-between mx-4 mb-2 px-4 py-3.5 rounded-[14px] ${isSelected ? 'bg-[#EFF6FF] border border-[#BFDBFE]' : 'bg-gray-50'}`}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setForm({ ...form, office: item.label });
                                            setShowOfficePicker(false);
                                        }}
                                    >
                                        <Text
                                            className={`text-[14px] font-bold flex-1 mr-2 ${isSelected ? 'text-[#1D4ED8]' : 'text-[#374151]'}`}
                                            numberOfLines={2}
                                        >
                                            {item.label}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={20} color="#1D4ED8" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}
