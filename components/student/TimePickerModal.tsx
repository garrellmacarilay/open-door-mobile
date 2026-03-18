import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TimePickerModalProps {
    visible: boolean;
    selectedTime: string; // e.g. "8:00 AM"
    onSelect: (time: string) => void;
    onClose: () => void;
}

const HOURS_AM = ['8', '9', '10', '11',];
const HOURS_PM = ['1', '2', '3', '4', '5'];
const MINUTES = ['00', '30'];

function parseTime(str: string): { hour: string; minute: string; period: 'AM' | 'PM' } {
    if (!str) return { hour: '8', minute: '00', period: 'AM' };
    const match = str.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return { hour: '8', minute: '00', period: 'AM' };
    const period = match[3].toUpperCase() as 'AM' | 'PM';
    const validHours = period === 'AM' ? HOURS_AM : HOURS_PM;
    const hour = validHours.includes(match[1]) ? match[1] : validHours[0];
    const minute = ['00', '30'].includes(match[2]) ? match[2] : '00';
    return { hour, minute, period };
}

export default function TimePickerModal({ visible, selectedTime, onSelect, onClose }: TimePickerModalProps) {
    const insets = useSafeAreaInsets();
    const [hour, setHour] = useState('8');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    const [mode, setMode] = useState<'hour' | 'minute'>('hour');

    // Sync state when modal opens
    useEffect(() => {
        if (visible) {
            const parsed = parseTime(selectedTime);
            setHour(parsed.hour);
            setMinute(parsed.minute);
            setPeriod(parsed.period);
            setMode('hour');
        }
    }, [visible, selectedTime]);

    const handleConfirm = () => {
        onSelect(`${hour}:${minute} ${period}`);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                className="flex-1 bg-black/40 justify-end"
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} className="w-full">
                    <View
                        className="w-full bg-white rounded-t-[28px] pt-4"
                        style={{ paddingBottom: Math.max(insets.bottom + 16, 28) }}
                    >
                        {/* Handle */}
                        <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-4" />

                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 mb-6">
                            <TouchableOpacity onPress={onClose} className="w-10 h-10 items-start justify-center" activeOpacity={0.6}>
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                            <Text className="text-[#1C274C] text-[18px] font-extrabold flex-1 text-center">Set Time</Text>
                            <TouchableOpacity
                                onPress={handleConfirm}
                                className="w-10 h-10 items-end justify-center"
                                activeOpacity={0.7}
                            >
                                <Text className="text-[#1D4ED8] text-[16px] font-bold">Done</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Live Preview / Mode Selectors */}
                        <View className="flex-row items-center justify-center gap-2 mb-8 px-6">
                            {/* Hour Box */}
                            <TouchableOpacity
                                onPress={() => setMode('hour')}
                                className={`w-20 h-20 items-center justify-center rounded-[16px] border-[2px] ${mode === 'hour' ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-gray-100 bg-gray-50'}`}
                                activeOpacity={0.8}
                            >
                                <Text className={`text-[32px] font-extrabold ${mode === 'hour' ? 'text-[#1D4ED8]' : 'text-[#4B5563]'}`}>
                                    {hour}
                                </Text>
                            </TouchableOpacity>

                            <Text className="text-[#1C274C] text-[32px] font-extrabold mx-1 mb-2">:</Text>

                            {/* Minute Box */}
                            <TouchableOpacity
                                onPress={() => setMode('minute')}
                                className={`w-20 h-20 items-center justify-center rounded-[16px] border-[2px] ${mode === 'minute' ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-gray-100 bg-gray-50'}`}
                                activeOpacity={0.8}
                            >
                                <Text className={`text-[32px] font-extrabold ${mode === 'minute' ? 'text-[#1D4ED8]' : 'text-[#4B5563]'}`}>
                                    {minute}
                                </Text>
                            </TouchableOpacity>

                            {/* AM / PM Toggle Box */}
                            <View className="ml-2 w-16 h-20 border border-gray-100 rounded-[14px] bg-gray-50 overflow-hidden shadow-sm">
                                <TouchableOpacity
                                    onPress={() => {
                                        setPeriod('AM');
                                        if (!HOURS_AM.includes(hour)) setHour(HOURS_AM[0]);
                                    }}
                                    className={`flex-1 items-center justify-center ${period === 'AM' ? 'bg-[#1D4ED8]' : 'bg-transparent'}`}
                                    activeOpacity={0.8}
                                >
                                    <Text className={`text-[13px] font-extrabold ${period === 'AM' ? 'text-white' : 'text-[#6B7280]'}`}>AM</Text>
                                </TouchableOpacity>
                                <View className="h-[1px] bg-gray-200" />
                                <TouchableOpacity
                                    onPress={() => {
                                        setPeriod('PM');
                                        if (!HOURS_PM.includes(hour)) setHour(HOURS_PM[0]);
                                    }}
                                    className={`flex-1 items-center justify-center ${period === 'PM' ? 'bg-[#1D4ED8]' : 'bg-transparent'}`}
                                    activeOpacity={0.8}
                                >
                                    <Text className={`text-[13px] font-extrabold ${period === 'PM' ? 'text-white' : 'text-[#6B7280]'}`}>PM</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Selection Grids */}
                        <View className="px-6 min-h-[160px]">
                            {mode === 'hour' ? (
                                <View>
                                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-wider mb-4 mx-1">Select Hour</Text>
                                    <View className="flex-row flex-wrap gap-2 justify-between">
                                        {(period === 'AM' ? HOURS_AM : HOURS_PM).map((h) => {
                                            const isSelected = h === hour;
                                            return (
                                                <TouchableOpacity
                                                    key={h}
                                                    onPress={() => { setHour(h); setMode('minute'); }}
                                                    className={`w-[23%] h-12 rounded-[12px] items-center justify-center mb-1 ${isSelected ? 'bg-[#1D4ED8]' : 'bg-gray-50 border border-gray-100'}`}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text className={`text-[16px] font-bold ${isSelected ? 'text-white' : 'text-[#4B5563]'}`}>
                                                        {h}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text className="text-gray-400 text-[12px] font-bold uppercase tracking-wider mb-4 mx-1">Select Minute</Text>
                                    <View className="flex-row gap-2">
                                        {MINUTES.map((m) => {
                                            const isSelected = m === minute;
                                            return (
                                                <TouchableOpacity
                                                    key={m}
                                                    onPress={() => setMinute(m)}
                                                    className={`flex-1 h-12 rounded-[12px] items-center justify-center ${isSelected ? 'bg-[#1D4ED8]' : 'bg-gray-50 border border-gray-100'}`}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text className={`text-[16px] font-bold ${isSelected ? 'text-white' : 'text-[#4B5563]'}`}>
                                                        {m}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Confirm Button */}
                        <View className="px-6 mt-8">
                            <TouchableOpacity
                                onPress={handleConfirm}
                                className="w-full h-[54px] bg-[#18233D] rounded-[16px] items-center justify-center flex-row gap-2"
                                activeOpacity={0.85}
                                style={{
                                    shadowColor: '#18233D',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 8,
                                    elevation: 6,
                                }}
                            >
                                <Ionicons name="checkmark-circle-outline" size={22} color="white" />
                                <Text className="text-white text-[16px] font-bold tracking-wide">
                                    Confirm Time
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
