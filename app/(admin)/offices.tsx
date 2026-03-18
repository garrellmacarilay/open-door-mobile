import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OFFICES_DATA = [
    {
        id: '1',
        label: 'Prefect and Assistant Prefect',
        email: 'prefect@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '2',
        label: 'Guidance',
        email: 'prefect.guidance@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '3',
        label: 'Medical Clinic',
        email: 'prefect.medical@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '4',
        label: 'Sports Development and Management',
        email: 'prefect.sports@laverdad.edu.ph',
        status: 'Inactive',
    },
    {
        id: '5',
        label: 'Student Assistance and Experiential Learning',
        email: 'prefect.studentassist@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '6',
        label: 'Student Discipline',
        email: 'prefect.discipline@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '7',
        label: 'Student Internship',
        email: 'prefect.internship@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '8',
        label: 'IT Support Services',
        email: 'prefect.itsupport@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '9',
        label: 'Student Organizations',
        email: 'prefect.organizations@laverdad.edu.ph',
        status: 'Active',
    },
    {
        id: '10',
        label: 'Student Publications',
        email: 'prefect.publications@laverdad.edu.ph',
        status: 'Active',
    },
];

export default function AdminOfficesPage() {
    const [offices, setOffices] = useState(OFFICES_DATA);
    const [showAddModal, setShowAddModal] = useState(false);
    const [officeName, setOfficeName] = useState('');
    const [officeEmail, setOfficeEmail] = useState('');

    const activeCount = offices.filter((o) => o.status === 'Active').length;

    const handleAddOffice = () => {
        if (!officeName.trim() || !officeEmail.trim()) {
            Alert.alert('Error', 'Please fill in office name and email');
            return;
        }

        const newOffice = {
            id: String(Math.random()),
            label: officeName,
            email: officeEmail,
            status: 'Active',
        };

        setOffices([...offices, newOffice]);
        setOfficeName('');
        setOfficeEmail('');
        setShowAddModal(false);
        Alert.alert('Success', 'Office added successfully');
    };

    const handleEdit = (id: string) => {
        Alert.alert('Edit', 'Edit functionality coming soon');
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Office', 'Are you sure you want to delete this office?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    setOffices(offices.filter((o) => o.id !== id));
                },
            },
        ]);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="bg-white px-6 pt-6 pb-5 border-b border-gray-100">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-1">
                            <Text className="text-[#1C274C] text-[26px] font-extrabold mb-1">
                                Offices
                            </Text>
                            <Text className="text-gray-500 text-[13px] font-semibold">
                                {activeCount} of {offices.length} available
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowAddModal(true)}
                            className="bg-[#7C3AED] rounded-[10px] px-4 py-2.5 flex-row items-center gap-1.5"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add" size={18} color="white" />
                            <Text className="text-white font-bold text-[13px]">Add Office</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Office List */}
                <View className="px-6 pt-4">
                    {offices.map((office) => (
                        <View
                            key={office.id}
                            className="bg-white rounded-[16px] p-4 mb-4 border border-gray-100 shadow-sm"
                        >
                            {/* Office Header with Icon and Name */}
                            <View className="flex-row items-start gap-3 mb-3">
                                <View className="w-12 h-12 bg-[#1C274C] rounded-[10px] items-center justify-center">
                                    <Ionicons
                                        name="home"
                                        size={24}
                                        color="white"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[#1C274C] text-[15px] font-extrabold mb-1">
                                        {office.label}
                                    </Text>
                                    <Text className="text-gray-500 text-[12px] font-semibold">
                                        {office.email}
                                    </Text>
                                </View>
                                <View className="bg-[#DCFCE7] rounded-full px-3 py-1">
                                    <Text className="text-[#22C55E] text-[11px] font-bold">
                                        {office.status}
                                    </Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => handleEdit(office.id)}
                                    className="flex-1 border border-gray-300 rounded-[10px] py-2.5 items-center"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-gray-600 font-bold text-[13px]">Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDelete(office.id)}
                                    className="flex-1 bg-[#EF4444] rounded-[10px] py-2.5 items-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white font-bold text-[13px]">Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {offices.length === 0 && (
                        <View className="bg-white rounded-[16px] p-12 items-center">
                            <Ionicons
                                name="home-outline"
                                size={48}
                                color="#D1D5DB"
                            />
                            <Text className="text-gray-400 text-center mt-3 font-semibold">
                                No offices found
                            </Text>
                        </View>
                    )}

                    <View className="h-24" />
                </View>
            </ScrollView>

            {/* Add Office Modal */}
            <Modal
                animationType="slide"
                transparent
                visible={showAddModal}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-[28px] px-6 pt-5 pb-10 shadow-xl">
                        {/* Drag handle */}
                        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-5" />
                        <Text className="text-[#1C274C] text-[22px] font-extrabold mb-6">
                            Add New Office
                        </Text>

                        {/* Office Name */}
                        <View className="mb-5">
                            <Text className="text-gray-500 text-[13px] font-bold mb-2 ml-1">
                                Office Name
                            </Text>
                            <TextInput
                                value={officeName}
                                onChangeText={setOfficeName}
                                placeholder="e.g., Student Affairs"
                                placeholderTextColor="#9CA3AF"
                                className="w-full border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                            />
                        </View>

                        {/* Email */}
                        <View className="mb-6">
                            <Text className="text-gray-500 text-[13px] font-bold mb-2 ml-1">
                                Email Address
                            </Text>
                            <TextInput
                                value={officeEmail}
                                onChangeText={setOfficeEmail}
                                placeholder="office@laverdad.edu.ph"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                className="w-full border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                            />
                        </View>

                        {/* Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowAddModal(false)}
                                className="flex-1 border border-gray-300 rounded-[12px] py-3.5 items-center"
                                activeOpacity={0.7}
                            >
                                <Text className="text-gray-600 font-bold text-[15px]">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleAddOffice}
                                className="flex-1 bg-[#7C3AED] rounded-[12px] py-3.5 items-center"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-bold text-[15px]">Add Office</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
