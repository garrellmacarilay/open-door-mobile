import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OFFICES_DATA = [
    {
        id: '1',
        label: 'Prefect and Assistant Prefect',
        email: 'prefect@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '2',
        label: 'Guidance',
        email: 'prefect.guidance@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '3',
        label: 'Medical Clinic',
        email: 'prefect.medical@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '4',
        label: 'Sports Development and Management',
        email: 'prefect.sports@laverdad.edu.ph',
        status: 'Unavailable',
    },
    {
        id: '5',
        label: 'Student Assistance and Experiential Learning',
        email: 'prefect.studentassist@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '6',
        label: 'Student Discipline',
        email: 'prefect.discipline@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '7',
        label: 'Student Internship',
        email: 'prefect.internship@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '8',
        label: 'IT Support Services',
        email: 'prefect.itsupport@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '9',
        label: 'Student Organizations',
        email: 'prefect.organizations@laverdad.edu.ph',
        status: 'Available',
    },
    {
        id: '10',
        label: 'Student Publications',
        email: 'prefect.publications@laverdad.edu.ph',
        status: 'Available',
    },
];

export default function AdminOfficesPage() {
    const insets = useSafeAreaInsets();
    const [offices, setOffices] = useState(OFFICES_DATA);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [officeName, setOfficeName] = useState('');
    const [officeEmail, setOfficeEmail] = useState('');
    const [selectedOfficeForEdit, setSelectedOfficeForEdit] = useState<any>(null);
    const [editOfficeName, setEditOfficeName] = useState('');
    const [editOfficeEmail, setEditOfficeEmail] = useState('');

    const availableCount = offices.filter((o) => o.status === 'Available').length;

    const handleAddOffice = () => {
        if (!officeName.trim() || !officeEmail.trim()) {
            Alert.alert('Error', 'Please fill in office name and email');
            return;
        }

        const newOffice = {
            id: String(Math.random()),
            label: officeName,
            email: officeEmail,
            status: 'Available',
        };

        setOffices([...offices, newOffice]);
        setOfficeName('');
        setOfficeEmail('');
        setShowAddModal(false);
        Alert.alert('Success', 'Office added successfully');
    };

    const handleEdit = (id: string) => {
        const office = offices.find((o) => o.id === id);
        if (office) {
            setSelectedOfficeForEdit(office);
            setEditOfficeName(office.label);
            setEditOfficeEmail(office.email);
            setShowEditModal(true);
        }
    };

    const handleSaveEdit = () => {
        if (!editOfficeName.trim() || !editOfficeEmail.trim()) {
            Alert.alert('Error', 'Please fill in office name and email');
            return;
        }

        setOffices(
            offices.map((o) =>
                o.id === selectedOfficeForEdit.id
                    ? { ...o, label: editOfficeName, email: editOfficeEmail }
                    : o
            )
        );
        setShowEditModal(false);
        setSelectedOfficeForEdit(null);
        setEditOfficeName('');
        setEditOfficeEmail('');
        Alert.alert('Success', 'Office updated successfully');
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
                                {availableCount} of {offices.length} available
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowAddModal(true)}
                            className="bg-[#1C274C] rounded-[10px] px-4 py-2.5 flex-row items-center gap-1.5"
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
                            {(() => {
                                const isAvailable = office.status === 'Available';

                                return (
                                    <>
                                        {/* Office Header with Icon and Name */}
                                        <View className="flex-row items-start gap-3 mb-3">
                                            <View className="w-12 h-12 bg-[#1C274C] rounded-[10px] items-center justify-center">
                                                <Ionicons
                                                    name="business-outline"
                                                    size={24}
                                                    color="white"
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-[#1C274C] text-[15px] font-extrabold mb-1">
                                                    {office.label}
                                                </Text>
                                                <Text className="text-gray-500 text-[12px] font-semibold mb-2">
                                                    {office.email}
                                                </Text>
                                                <View
                                                    className="self-start rounded-full px-3 py-1"
                                                    style={{
                                                        backgroundColor: isAvailable ? '#DCFCE7' : '#FEE2E2',
                                                    }}
                                                >
                                                    <Text
                                                        className="text-[11px] font-bold"
                                                        style={{
                                                            color: isAvailable ? '#22C55E' : '#DC2626',
                                                        }}
                                                    >
                                                        {office.status}
                                                    </Text>
                                                </View>
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
                                                className="flex-1 bg-[#B91C1C] rounded-[10px] py-2.5 items-center"
                                                activeOpacity={0.8}
                                            >
                                                <Text className="text-white font-bold text-[13px]">Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                );
                            })()}
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

                    <View style={{ height: Math.max(insets.bottom + 96, 128) }} />
                </View>
            </ScrollView>

            {/* Add Office Modal */}
            <Modal
                animationType="slide"
                transparent
                statusBarTranslucent
                navigationBarTranslucent
                visible={showAddModal}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 justify-end">
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
                                className="flex-1 bg-[#1C274C] rounded-[12px] py-3.5 items-center"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-bold text-[15px]">Add Office</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Office Modal */}
            <Modal
                animationType="slide"
                transparent
                statusBarTranslucent
                navigationBarTranslucent
                visible={showEditModal}
                onRequestClose={() => setShowEditModal(false)}
            >
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-[28px] px-6 pt-5 pb-10 shadow-xl">
                        {/* Drag handle */}
                        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-5" />
                        <Text className="text-[#1C274C] text-[22px] font-extrabold mb-1">
                            Edit Office
                        </Text>
                        <Text className="text-gray-500 text-[13px] font-semibold mb-6">
                            Fill in the office details
                        </Text>

                        {/* Office Name */}
                        <View className="mb-5">
                            <Text className="text-gray-700 text-[13px] font-bold mb-2 ml-1">
                                Office Name
                            </Text>
                            <TextInput
                                value={editOfficeName}
                                onChangeText={setEditOfficeName}
                                placeholder="Office name"
                                placeholderTextColor="#9CA3AF"
                                className="w-full border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                            />
                        </View>

                        {/* Email */}
                        <View className="mb-6">
                            <Text className="text-gray-700 text-[13px] font-bold mb-2 ml-1">
                                Email Address
                            </Text>
                            <TextInput
                                value={editOfficeEmail}
                                onChangeText={setEditOfficeEmail}
                                placeholder="email@laverdad.edu.ph"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                className="w-full border border-gray-300 rounded-[12px] px-4 py-3.5 text-gray-800 text-[15px]"
                            />
                        </View>

                        {/* Buttons */}
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setShowEditModal(false)}
                                className="flex-1 border border-gray-300 rounded-[12px] py-3.5 items-center"
                                activeOpacity={0.7}
                            >
                                <Text className="text-gray-600 font-bold text-[15px]">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveEdit}
                                className="flex-1 bg-[#1C274C] rounded-[12px] py-3.5 items-center"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-bold text-[15px]">Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
