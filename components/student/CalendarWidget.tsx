import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalendarWidgetProps {
    currentDate?: Date;
    events?: any[];
    onDateSelect?: (date: Date) => void;
    onBookPress?: () => void;
}

export default function CalendarWidget({
    currentDate: initialDate = new Date(),
    events = [],
    onDateSelect,
    onBookPress
}: CalendarWidgetProps) {
    const [viewDate, setViewDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Calendar Logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Navigation
    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(viewDate);
        if (direction === 'prev') {
            newDate.setMonth(currentMonth - 1);
        } else {
            newDate.setMonth(currentMonth + 1);
        }
        setViewDate(newDate);
    };

    const handleTodayClick = () => {
        const today = new Date();
        setViewDate(today);
        setSelectedDate(today);
        onDateSelect?.(today);
    };

    // Events Mapping
    const eventsByDate = useMemo(() => {
        const map: Record<string, boolean> = {};
        events.forEach(evt => {
            if (evt.dateString) {
                // Assuming dateString is parseable or we should rely on raw date if available
                // Adjust this matching logic based on actual data format in Dashboard.tsx
                // DUMMY_APPOINTMENTS uses "December 15, 2025" format
                const d = new Date(evt.dateString);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                map[key] = true;
            }
        });
        return map;
    }, [events]);

    const renderDays = () => {
        const days = [];
        const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;

        for (let i = 0; i < totalSlots; i++) {
            const dayNumber = i - firstDay + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;

            if (!isCurrentMonth) {
                days.push(<View key={`empty-${i}`} className="w-[14.28%] aspect-square" />);
                continue;
            }

            const cellDate = new Date(currentYear, currentMonth, dayNumber);
            const isSelected = selectedDate.getDate() === dayNumber &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

            const isToday = new Date().getDate() === dayNumber &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

            // Check for events
            const dateKey = `${currentYear}-${currentMonth}-${dayNumber}`;
            const hasEvent = eventsByDate[dateKey];

            days.push(
                <TouchableOpacity
                    key={dayNumber}
                    className={`w-[14.28%] aspect-square items-center justify-center relative`}
                    onPress={() => {
                        setSelectedDate(cellDate);
                        onDateSelect?.(cellDate);
                    }}
                >
                    <View className={`w-8 h-8 items-center justify-center rounded-full ${isSelected ? 'bg-[#4F46E5]' : ''}`}>
                        <Text className={`font-medium text-sm ${isSelected ? 'text-white' : isToday ? 'text-[#4F46E5]' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins-Medium' }}>
                            {dayNumber}
                        </Text>
                    </View>
                    {hasEvent && !isSelected && (
                        <View className="absolute bottom-1 w-1 h-1 bg-[#4F46E5] rounded-full" />
                    )}
                </TouchableOpacity>
            );
        }
        return days;
    };

    return (
        <View className="bg-white rounded-2xl p-5 shadow-md mb-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-5">
                {/* Month Navigation */}
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => navigateMonth('prev')} className="w-8 h-8 items-center justify-center">
                        <Ionicons name="chevron-back" size={20} color="#1C2A48" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-[#1C2A48] min-w-[140px] text-center" style={{ fontFamily: 'Poppins-Bold' }}>
                        {monthName}
                    </Text>
                    <TouchableOpacity onPress={() => navigateMonth('next')} className="w-8 h-8 items-center justify-center">
                        <Ionicons name="chevron-forward" size={20} color="#1C2A48" />
                    </TouchableOpacity>
                </View>

                {/* Book Button */}
                <TouchableOpacity
                    className="bg-[#1C2A48] rounded-lg px-4 py-2"
                    onPress={onBookPress}
                >
                    <Text className="text-white text-xs font-semibold" style={{ fontFamily: 'Poppins-SemiBold' }}>
                        Book
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Weekdays */}
            <View className="flex-row justify-between mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <View key={index} className="w-[14.28%] items-center">
                        <Text className="text-xs text-gray-500 font-semibold" style={{ fontFamily: 'Inter-SemiBold' }}>
                            {day}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Grid */}
            <View className="flex-row flex-wrap mb-4">
                {renderDays()}
            </View>

            {/* Color Legend */}
            <View className="flex-row justify-center items-center gap-4 pt-3 border-t border-gray-100">
                <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <Text className="text-[10px] text-gray-600">Pending</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <Text className="text-[10px] text-gray-600">Approved</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <Text className="text-[10px] text-gray-600">Declined</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <Text className="text-[10px] text-gray-600">Completed</Text>
                </View>
            </View>
        </View>
    );
}
