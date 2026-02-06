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
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            {/* Header - Referenced from CalendarHeader.jsx but adapted for Mobile */}
            <View className="flex-row justify-between items-center mb-6">
                {/* Today Button (Icon) */}
                <TouchableOpacity onPress={handleTodayClick} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <Ionicons name="calendar-outline" size={18} color="#142240" />
                </TouchableOpacity>

                {/* Month Navigation */}
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => navigateMonth('prev')}>
                        <Ionicons name="chevron-back" size={20} color="#142240" />
                    </TouchableOpacity>
                    <Text className="text-base font-bold text-[#142240]" style={{ fontFamily: 'Poppins-Bold' }}>
                        {monthName}
                    </Text>
                    <TouchableOpacity onPress={() => navigateMonth('next')}>
                        <Ionicons name="chevron-forward" size={20} color="#142240" />
                    </TouchableOpacity>
                </View>

                {/* Book/Add Button (Placeholder for 'Book Consultation') */}
                <TouchableOpacity
                    className="p-2 bg-[#1156E8] rounded-lg"
                    onPress={onBookPress}
                >
                    <Ionicons name="add" size={18} color="white" />
                </TouchableOpacity>
            </View>

            {/* Weekdays */}
            <View className="flex-row justify-between mb-2 border-b border-gray-100 pb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <Text key={index} className="w-[14.28%] text-center text-xs text-gray-400 font-medium" style={{ fontFamily: 'Inter-Medium' }}>
                        {day}
                    </Text>
                ))}
            </View>

            {/* Grid */}
            <View className="flex-row flex-wrap">
                {renderDays()}
            </View>
        </View>
    );
}
