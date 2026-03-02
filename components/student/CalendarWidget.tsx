import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

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
}: CalendarWidgetProps) {
    const [viewDate, setViewDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const monthName = viewDate.toLocaleDateString('en-US', { month: 'long' });
    const yearString = viewDate.toLocaleDateString('en-US', { year: 'numeric' });

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

    // Events Mapping
    const eventsByDate = useMemo(() => {
        const map: Record<string, any[]> = {};
        events.forEach(evt => {
            if (evt.dateString) {
                const d = new Date(evt.dateString);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                if (!map[key]) map[key] = [];
                map[key].push(evt);
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
            const isWeekend = i % 7 === 0 || i % 7 === 6;

            if (!isCurrentMonth) {
                // Determine previous month days to show as faded
                const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
                const fadeDay = dayNumber <= 0 ? prevMonthDays + dayNumber : dayNumber - daysInMonth;

                days.push(
                    <View key={`empty-${i}`} className="w-[14.28%] aspect-square flex items-center justify-start pt-2">
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

            days.push(
                <TouchableOpacity
                    key={dayNumber}
                    className="w-[14.28%] aspect-square items-center justify-start pt-2 relative"
                    onPress={() => {
                        setSelectedDate(cellDate);
                        onDateSelect?.(cellDate);
                    }}
                    activeOpacity={0.6}
                >
                    <Text className={`text-[13px] font-bold ${isWeekend ? 'text-[#3B82F6]' : 'text-[#1C274C]'}`}>
                        {dayNumber}
                    </Text>

                    {/* Render mini pills for events */}
                    {dayEvents.length > 0 && (
                        <View className="absolute bottom-1 w-full items-center gap-0.5">
                            {dayEvents.slice(0, 2).map((evt, idx) => (
                                <View key={idx} className={`rounded-sm px-1 ${evt.details?.status === 'approved' ? 'bg-[#DCFCE7]' : 'bg-[#DBEAFE]'}`}>
                                    <Text className="text-[6px] font-bold text-gray-800" numberOfLines={1}>
                                        {evt.time || '11:00 AM'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </TouchableOpacity>
            );
        }
        return days;
    };

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
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => navigateMonth('prev')} className="p-2" activeOpacity={0.7}>
                        <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>

                    <View className="items-center">
                        <Text className="text-[20px] font-bold text-white tracking-wide">
                            {monthName}
                        </Text>
                        <Text className="text-[13px] font-semibold text-[#3B82F6] mt-0.5">
                            {yearString}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => navigateMonth('next')} className="p-2" activeOpacity={0.7}>
                        <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Calendar Body */}
            <View className="px-4 pt-4 pb-6">
                {/* Weekdays */}
                <View className="flex-row justify-between mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                        const isWeekend = index === 0 || index === 6;
                        return (
                            <View key={index} className="w-[14.28%] items-center">
                                <Text className={`text-[11px] font-bold ${isWeekend ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`}>
                                    {day}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Grid */}
                <View className="flex-row flex-wrap mb-6">
                    {renderDays()}
                </View>

                {/* Color Legend */}
                <View className="flex-row justify-center items-center gap-x-5 px-2">
                    <View className="flex-row items-center gap-1.5">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Pending</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Approved</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Declined</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                        <Text className="text-[10px] font-bold text-[#6B7280]">Events</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

