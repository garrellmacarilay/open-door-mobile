import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerModalProps {
    visible: boolean;
    selectedDate: string; // 'mm/dd/yyyy' or ''
    onSelect: (date: string) => void;
    onClose: () => void;
    minDaysFromNow?: number; // enforce minimum days ahead
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function pad(n: number) { return n < 10 ? '0' + n : '' + n; }

function toDateString(year: number, month: number, day: number) {
    return `${pad(month + 1)}/${pad(day)}/${year}`;
}

function parseDate(str: string): Date | null {
    if (!str) return null;
    const parts = str.split('/');
    if (parts.length !== 3) return null;
    const d = new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
    return isNaN(d.getTime()) ? null : d;
}

export default function DatePickerModal({
    visible,
    selectedDate,
    onSelect,
    onClose,
    minDaysFromNow = 2,
}: DatePickerModalProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Minimum selectable date
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDaysFromNow);

    const parsedSelected = parseDate(selectedDate);

    const [viewYear, setViewYear] = useState(
        parsedSelected ? parsedSelected.getFullYear() : today.getFullYear()
    );
    const [viewMonth, setViewMonth] = useState(
        parsedSelected ? parsedSelected.getMonth() : today.getMonth()
    );

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Day of week for 1st (0=Sun…6=Sat) → convert to Mon-start (Mon=0)
    const rawFirst = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const firstDayOffset = (rawFirst + 6) % 7; // Mon=0, Tue=1, … Sun=6

    const totalCells = Math.ceil((daysInMonth + firstDayOffset) / 7) * 7;

    const navigateMonth = (dir: 'prev' | 'next') => {
        let m = viewMonth + (dir === 'next' ? 1 : -1);
        let y = viewYear;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        setViewMonth(m);
        setViewYear(y);
    };

    const handleDayPress = (day: number) => {
        const d = new Date(viewYear, viewMonth, day);
        if (d < minDate) return; // blocked
        onSelect(toDateString(viewYear, viewMonth, day));
        onClose();
    };

    const isSelected = (day: number) => {
        if (!parsedSelected) return false;
        return (
            parsedSelected.getFullYear() === viewYear &&
            parsedSelected.getMonth() === viewMonth &&
            parsedSelected.getDate() === day
        );
    };

    const isToday = (day: number) => {
        return (
            today.getFullYear() === viewYear &&
            today.getMonth() === viewMonth &&
            today.getDate() === day
        );
    };

    const isDisabled = (day: number) => {
        const d = new Date(viewYear, viewMonth, day);
        return d < minDate;
    };

    // Build cells array
    const cells: (number | null)[] = [];
    for (let i = 0; i < totalCells; i++) {
        const day = i - firstDayOffset + 1;
        cells.push(day >= 1 && day <= daysInMonth ? day : null);
    }

    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                className="flex-1 bg-black/40 justify-end"
                activeOpacity={1}
                onPress={onClose}
            >
                {/* Prevent close when tapping inside */}
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    <View className="bg-white rounded-t-[28px] pb-10 pt-4 px-4">
                        {/* Handle */}
                        <View className="w-10 h-1 rounded-full bg-gray-200 self-center mb-5" />

                        {/* Month Navigation */}
                        <View className="flex-row items-center justify-between px-2 mb-4">
                            <TouchableOpacity
                                onPress={() => navigateMonth('prev')}
                                className="p-2 rounded-full bg-gray-100"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="chevron-back" size={18} color="#374151" />
                            </TouchableOpacity>

                            <View className="flex-row items-center gap-1">
                                <Text className="text-[#1C274C] text-[17px] font-extrabold">
                                    {MONTHS[viewMonth]} {viewYear}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#6B7280" />
                            </View>

                            <TouchableOpacity
                                onPress={() => navigateMonth('next')}
                                className="p-2 rounded-full bg-gray-100"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="chevron-forward" size={18} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        {/* Weekday Headers */}
                        <View className="flex-row justify-between mb-2 px-1">
                            {WEEKDAYS.map((d, i) => (
                                <View key={i} className="flex-1 items-center">
                                    <Text className={`text-[12px] font-bold ${i >= 5 ? 'text-[#7C3AED]' : 'text-[#9CA3AF]'}`}>
                                        {d}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Calendar Grid */}
                        <View className="flex-row flex-wrap px-1 mb-4">
                            {cells.map((day, index) => {
                                if (!day) {
                                    return <View key={`empty-${index}`} style={{ width: '14.28%', aspectRatio: 1 }} />;
                                }

                                const selected = isSelected(day);
                                const today_ = isToday(day);
                                const disabled = isDisabled(day);
                                const isWeekend = index % 7 >= 5;

                                return (
                                    <TouchableOpacity
                                        key={day}
                                        style={{ width: '14.28%', aspectRatio: 1 }}
                                        className="items-center justify-center"
                                        onPress={() => handleDayPress(day)}
                                        activeOpacity={disabled ? 1 : 0.7}
                                    >
                                        <View
                                            className={`w-9 h-9 rounded-full items-center justify-center
                                                ${selected ? 'bg-[#7C3AED]' : ''}
                                                ${today_ && !selected ? 'border-2 border-[#7C3AED]' : ''}
                                            `}
                                        >
                                            <Text
                                                className={`text-[14px] font-bold
                                                    ${selected ? 'text-white' : ''}
                                                    ${!selected && disabled ? 'text-gray-200' : ''}
                                                    ${!selected && !disabled && isWeekend ? 'text-[#7C3AED]' : ''}
                                                    ${!selected && !disabled && !isWeekend ? 'text-[#1C274C]' : ''}
                                                `}
                                            >
                                                {day}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Hint */}
                        {minDaysFromNow > 0 && (
                            <View className="flex-row items-center justify-center gap-1 mb-2">
                                <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
                                <Text className="text-gray-400 text-[11px] font-medium">
                                    Booking must be at least {minDaysFromNow} days before the scheduled date
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
