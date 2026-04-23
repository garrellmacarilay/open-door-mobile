import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, FlatList, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import DatePickerModal from './DatePickerModal';
import TimePickerModal from './TimePickerModal';

interface BookConsultationModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
    offices: any[];
    isSubmitting?: boolean;
}

export default function BookConsultationModal({ 
    visible, 
    onClose, 
    onSubmit, 
    offices, 
    isSubmitting 
}: BookConsultationModalProps) {
    const [form, setForm] = useState({
        office_id: '',
        office_name: '',
        date: '',
        time: '',
        concern_description: '',
        group_members: '',
        uploaded_file_url: null as any,
    });

    const [showOfficePicker, setShowOfficePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // 🚀 Reset form whenever the modal opens to ensure a clean state
    useEffect(() => {
        if (visible) {
            setForm({
                office_id: '',
                office_name: '',
                date: '',
                time: '',
                concern_description: '',
                group_members: '',
                uploaded_file_url: null,
            });
        }
    }, [visible]);

    const handleFilePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                setForm(prev => ({ ...prev, uploaded_file_url: result.assets[0] }));
            }
        } catch (err) {
            console.error("File picking error:", err);
        }
    };

    const handleSubmit = () => {
        if (!form.office_id || !form.date || !form.time || !form.concern_description) {
            alert('Please fill in all required fields');
            return;
        }

        onSubmit({
            office_id: form.office_id,
            date: form.date,
            time: form.time,
            concern_description: form.concern_description,
            group_members: form.group_members,
            uploaded_file_url: form.uploaded_file_url,
            service_type: 'Consultation'
        });
    };

    const renderLabel = (text: string, required = false) => (
        <Text className="text-[#1F2937] text-[13px] font-bold mb-2 ml-1">
            {text} {required && <Text className="text-red-500">*</Text>}
        </Text>
    );

    return (
        <>
            <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
                <View className="flex-1 bg-black/40 justify-center items-center py-10 px-4">
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                        className="w-full max-w-sm"
                    >
                        <View className="bg-white rounded-[24px] w-full overflow-hidden shadow-lg">
                            
                            {/* Header */}
                            <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
                                <Text className="text-[#1C274C] text-[20px] font-extrabold">Book an Appointment</Text>
                                <TouchableOpacity onPress={onClose} className="w-8 h-8 items-center justify-center rounded-full bg-gray-50">
                                    <Ionicons name="close" size={20} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView className="w-full" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                                
                                {/* Office Selector */}
                                <View className="mb-4">
                                    {renderLabel('Office', true)}
                                    <TouchableOpacity
                                        className={`w-full h-[46px] border rounded-[10px] px-3 flex-row items-center justify-between bg-white ${form.office_id ? 'border-[#1D4ED8]' : 'border-gray-200'}`}
                                        onPress={() => setShowOfficePicker(true)}
                                    >
                                        <Text className={`flex-1 text-[14px] ${form.office_id ? 'text-[#1C274C] font-semibold' : 'text-gray-400'}`} numberOfLines={1}>
                                            {form.office_name || 'Select Office'}
                                        </Text>
                                        <Ionicons name="chevron-down" size={18} color={form.office_id ? '#1D4ED8' : '#9CA3AF'} />
                                    </TouchableOpacity>
                                </View>

                                {/* Date & Time Row */}
                                <View className="flex-row gap-3 mb-4">
                                    <View className="flex-1">
                                        {renderLabel('Date', true)}
                                        <TouchableOpacity className={`w-full h-[46px] border rounded-[10px] px-3 flex-row items-center justify-between bg-white ${form.date ? 'border-[#1D4ED8]' : 'border-gray-200'}`} onPress={() => setShowDatePicker(true)}>
                                            <Text className={`text-[14px] ${form.date ? 'text-[#1C274C] font-semibold' : 'text-gray-400'}`}>{form.date || 'mm/dd/yyyy'}</Text>
                                            <Ionicons name="calendar-outline" size={18} color={form.date ? '#1D4ED8' : '#9CA3AF'} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-1">
                                        {renderLabel('Time', true)}
                                        <TouchableOpacity className={`w-full h-[46px] border rounded-[10px] px-3 flex-row items-center justify-between bg-white ${form.time ? 'border-[#1D4ED8]' : 'border-gray-200'}`} onPress={() => setShowTimePicker(true)}>
                                            <Text className={`text-[14px] ${form.time ? 'text-[#1C274C] font-semibold' : 'text-gray-400'}`}>{form.time || '8:00 AM'}</Text>
                                            <Ionicons name="time-outline" size={18} color={form.time ? '#1D4ED8' : '#9CA3AF'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Concern Description */}
                                <View className="mb-4">
                                    {renderLabel('Topic/Purpose', true)}
                                    <TextInput
                                        className="w-full border border-gray-200 rounded-[10px] px-3 py-3 text-[#1F2937] text-[14px] bg-white"
                                        placeholder="Brief overview of your concern..."
                                        multiline numberOfLines={4}
                                        style={{ height: 100, textAlignVertical: 'top' }}
                                        value={form.concern_description}
                                        onChangeText={(text) => setForm({ ...form, concern_description: text })}
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>

                                {/* Group Members */}
                                <View className="mb-4">
                                    {renderLabel('Group Members (Optional)')}
                                    <TextInput
                                        className="w-full h-[46px] border border-gray-200 rounded-[10px] px-3 text-[#1F2937] text-[14px]"
                                        placeholder="e.g. Garrell, Marga"
                                        value={form.group_members}
                                        onChangeText={(text) => setForm({ ...form, group_members: text })}
                                    />
                                </View>

                                {/* Attachment */}
                                <View className="mb-8">
                                    {renderLabel('Attachment (Optional)')}
                                    <TouchableOpacity 
                                        onPress={handleFilePick}
                                        className={`w-full border border-dashed rounded-[10px] items-center justify-center py-6 bg-white ${form.uploaded_file_url ? 'border-[#3B82F6] bg-blue-50' : 'border-gray-200'}`}
                                    >
                                        <Ionicons name={form.uploaded_file_url ? "document-text" : "cloud-upload-outline"} size={28} color="#3B82F6" />
                                        <Text className="text-gray-400 text-[12px] mt-2" numberOfLines={1}>
                                            {form.uploaded_file_url ? form.uploaded_file_url.name : 'PDF, JPG, PNG (Max 5 MB)'}
                                        </Text>
                                        <Text className="text-[#3B82F6] text-[13px] font-semibold mt-1">
                                            {form.uploaded_file_url ? 'Change File' : 'Browse File'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Book Button */}
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`w-full h-[50px] rounded-[10px] items-center justify-center mt-2 ${isSubmitting ? 'bg-gray-400' : 'bg-[#18233D]'}`}
                                >
                                    {isSubmitting ? <ActivityIndicator color="white" /> : <Text className="text-white text-[16px] font-bold">Book</Text>}
                                </TouchableOpacity>

                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Office Picker Modal */}
            <Modal animationType="slide" transparent visible={showOfficePicker}>
                <TouchableOpacity className="flex-1 bg-black/40 justify-end" onPress={() => setShowOfficePicker(false)}>
                    <View className="bg-white rounded-t-[28px] pb-10 pt-4">
                        <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-4" />
                        <Text className="px-6 text-[#1C274C] text-[18px] font-extrabold mb-4">Select Office</Text>
                        <FlatList
                            data={offices}
                            keyExtractor={(item) => item.id.toString()}
                            style={{ maxHeight: 400 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className={`mx-4 mb-2 px-4 py-3.5 rounded-[14px] ${form.office_id === item.id.toString() ? 'bg-[#EFF6FF]' : 'bg-gray-50'}`}
                                    onPress={() => {
                                        setForm({ ...form, office_id: item.id.toString(), office_name: item.office_name });
                                        setShowOfficePicker(false);
                                    }}
                                >
                                    <Text className="font-bold text-[#374151]">{item.office_name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <DatePickerModal 
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                selectedDate={form.date}
                onSelect={(date) => {
                    setForm(prev => ({ ...prev, date }));
                    setShowDatePicker(false);
                }}
            />

            <TimePickerModal 
                visible={showTimePicker}
                selectedTime={form.time}
                onClose={() => setShowTimePicker(false)}
                onSelect={(time) => {
                    setForm(prev => ({ ...prev, time }));
                    setShowTimePicker(false);
                }}
            />
        </>
    );
}