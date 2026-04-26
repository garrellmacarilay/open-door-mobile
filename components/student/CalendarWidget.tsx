import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { UserRole } from '@/utils/auth';


interface CalendarWidgetProps {
    currentDate?: Date;
    events?: any[];
    appointments?: any[];
    onDateSelect?: (date: Date) => void;
    onMonthChange?: (date: Date) => void;
    onBookPress?: () => void;
    onAddEvent?: () => void;
    userRole?: UserRole;
}

export default function CalendarWidget({
    currentDate: initialDate = new Date(),
    events = [],
    appointments = [],
    onDateSelect,
    onMonthChange,
    onAddEvent,
    userRole
}: CalendarWidgetProps) {
    const [viewDate, setViewDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const today = new Date();

    const monthName = viewDate.toLocaleDateString('en-US', { month: 'long' });
    const yearString = viewDate.toLocaleDateString('en-US', { year: 'numeric' });
    const usesSplitHeaderLayout = !onAddEvent;

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
        onMonthChange?.(newDate)
    };

    // Events Mapping (FIXED VERSION)
    const eventsByDate = useMemo(() => {
        const map: Record<string, any[]> = {};
        
        const processItems = (items: any[]) => {
            if (!Array.isArray(items)) return;
            
            items.forEach(item => {
                const dateStr = item.dateString || item.start;
                if (dateStr) {
                    // dateStr is "2024-05-01 14:30:00" -> split(' ')[0] gets "2024-05-01"
                    const [year, month, day] = dateStr.split(' ')[0].split('-').map(Number);
                    
                    // Match the key format used in renderDays: YYYY-MonthIndex-Day
                    // Note: Month in split is 1-12, but JS Date months in renderDays are 0-11
                    const key = `${year}-${month - 1}-${day}`;
                    
                    if (!map[key]) map[key] = [];
                    map[key].push(item);
                }
            });
        };

        processItems(appointments);
        processItems(events);
        
        return map;
    }, [appointments, events]);

    const renderDays = () => {
        const days = [];
        const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;

        for (let i = 0; i < totalSlots; i++) {
            const dayNumber = i - firstDay + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            const isWeekend = i % 7 === 0 || i % 7 === 6;

            if (!isCurrentMonth) {
                // Determine previous month days to show as faded
                const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
                const fadeDay = dayNumber <= 0 ? prevMonthDays + dayNumber : dayNumber - daysInMonth;

                days.push(
                    <View key={`empty-${i}`} className="w-[14.28%] aspect-square flex items-center justify-center">
                        <Text className="text-[13px] font-bold text-gray-300">
                            {fadeDay}
                        </Text>
                    </View>
                );
                continue;
            }

            const cellDate = new Date(currentYear, currentMonth, dayNumber);
            const dateKey = `${currentYear}-${currentMonth}-${dayNumber}`;
            const dayEvents = eventsByDate[dateKey] || [];
            
            const isToday =
                today.getFullYear() === currentYear &&
                today.getMonth() === currentMonth &&
                today.getDate() === dayNumber;
            
            const isSelected =
                selectedDate.getFullYear() === currentYear &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getDate() === dayNumber;

            days.push(
                <TouchableOpacity
                    key={dayNumber}
                    className="w-[14.28%] aspect-square items-center justify-center relative"
                    onPress={() => {
                        setSelectedDate(cellDate);
                        onDateSelect?.(cellDate);
                    }}
                    activeOpacity={0.6}
                >
                    <View
                        className={`w-9 h-9 rounded-full items-center justify-center ${isSelected ? 'bg-[#18233D]' : ''}`}
                        style={isToday && !isSelected ? { borderWidth: 2, borderColor: '#3B82F6' } : undefined}
                    >
                        <Text className={`text-[14px] font-bold ${isSelected ? 'text-white' : isWeekend ? 'text-[#3B82F6]' : 'text-[#1C274C]'}`}>
                            {dayNumber}
                        </Text>
                    </View>

                    {/* Status indicator dots */}
                    {dayEvents.length > 0 && (
                        <View className="absolute bottom-1 flex-row gap-1">
                            {dayEvents.slice(0, 3).map((evt, idx) => {
                                let dotColor = '#3B82F6'; // Events default
                                if (evt.details?.status === 'pending') dotColor = '#EAB308'; // Yellow
                                else if (evt.details?.status === 'approved') dotColor = '#22C55E'; // Green
                                else if (evt.details?.status === 'declined') dotColor = '#EF4444'; // Red
                                return (
                                    <View key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                                );
                            })}
                        </View>
                    )}
                </TouchableOpacity>
            );
        }
        return days;
    };
    //helper variable

    const canAddEvent = onAddEvent && (userRole === 'staff' || userRole === 'admin')

    return (
        <View className="bg-white rounded-[24px] shadow-sm mb-6 border border-gray-100" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
        }}>
            {/* Header (Dark Blue) */}
            <View className="bg-[#18233D] rounded-t-[24px] px-6 py-5">
                {usesSplitHeaderLayout ? (
                    <View className="relative h-14 items-center justify-center">

                        <View className="absolute left-11 top-0 bottom-0 justify-center">
                            <TouchableOpacity
                                onPress={() => navigateMonth('prev')}
                                activeOpacity={0.7}
                                className="w-9 h-9 rounded-lg bg-white items-center justify-center"
                            >
                                <ChevronLeft size={18} color="#18233D" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        <View className="items-center px-12">
                            <Text className="text-[20px] font-bold text-white tracking-wide">
                                {monthName}
                            </Text>
                            <Text className="text-[13px] font-semibold text-[#3B82F6] mt-0.5">
                                {yearString}
                            </Text>
                        </View>

                        <View className="absolute right-11 top-0 bottom-0 justify-center">
                            <TouchableOpacity
                                onPress={() => navigateMonth('next')}
                                activeOpacity={0.7}
                                className="w-9 h-9 rounded-lg bg-white items-center justify-center"
                            >
                                <ChevronRight size={18} color="#18233D" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View className="flex-row items-center justify-between py-1">
                        <View className="flex-row items-baseline">
                            <Text className="text-[20px] font-bold text-white tracking-wide">
                                {monthName}
                            </Text>
                            <Text className="text-[20px] font-bold text-[#3B82F6] ml-3 tracking-wide">
                                {yearString}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity
                                onPress={() => navigateMonth('prev')}
                                activeOpacity={0.7}
                                className="w-11 h-11 rounded-2xl bg-white items-center justify-center"
                            >
                                <ChevronLeft size={24} color="#000" strokeWidth={2.7} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigateMonth('next')}
                                activeOpacity={0.7}
                                className="w-11 h-11 rounded-2xl bg-white items-center justify-center"
                            >
                                <ChevronRight size={24} color="#000" strokeWidth={2.7} />
                            </TouchableOpacity>
                            {canAddEvent && (
                                <TouchableOpacity
                                    onPress={onAddEvent}
                                    activeOpacity={0.7}
                                    className="w-11 h-11 rounded-2xl bg-white items-center justify-center"
                                >
                                    <Plus size={24} color="#000" strokeWidth={2.7} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </View>

            {/* Calendar Body */}
            <View className="px-4 pt-4 pb-3">
                {/* Weekdays */}
                <View className="flex-row justify-between mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                        const isWeekend = index === 0 || index === 6;
                        return (
                            <View key={index} className="w-[14.28%] items-center">
                                <Text className={`text-[12px] font-bold ${isWeekend ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`}>
                                    {day}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Grid */}
                <View className="flex-row flex-wrap mb-3">
                    {renderDays()}
                </View>

                {/* Color Legend */}
                <View className="flex-row justify-center items-center gap-x-4 px-2">
                    <View className="flex-row items-center gap-1">
                        <View className="w-2 h-2 rounded-full bg-[#EAB308]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Pending</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <View className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Approved</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <View className="w-2 h-2 rounded-full bg-[#EF4444]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Declined</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <View className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Events</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <View className="w-3 h-3 rounded-full border-2 border-[#3B82F6]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Today</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

