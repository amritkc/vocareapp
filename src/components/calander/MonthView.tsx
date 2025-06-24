"use client";

import React, { useState, useEffect } from "react";
import { 
  format, 
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth, 
  isSameDay, 
  getDay,
  addDays,
  subDays
} from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppointmentHoverCard } from "./AppointmentHoverCard";
import { Card } from "@/components/ui/card";

interface Appointment {
  id: string;
  title: string;
  date: Date;
  timeStart: string;
  timeEnd: string;
  location?: string;
  details?: string[];
  color: string;
  patient?: string;
  category?: string;
}

interface MonthViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onViewAppointment?: (id: string) => void;
}

export default function MonthView({ 
  appointments, 
  selectedDate, 
  onDateSelect,
  onViewAppointment 
}: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<Date>(selectedDate);

  useEffect(() => {
    setSelectedDay(selectedDate);
    
    // Update current month if selectedDate month changes
    if (selectedDate.getMonth() !== currentMonth.getMonth() || 
        selectedDate.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate, currentMonth]);

  // Generate days for the calendar
  const calendarDays = React.useMemo(() => {
    // Start with the first day of the month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Get all days in the month
    let days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Determine the first day of the week (0 = Sunday, 1 = Monday, etc.)
    // Adjust for Monday as the first day of week
    const firstDayOfWeek = getDay(monthStart) || 7;
    
    // Add days from previous month to fill the first row
    const daysFromPreviousMonth = firstDayOfWeek - 1; // -1 because we want Monday as first day
    if (daysFromPreviousMonth > 0) {
      const previousDays = Array.from({ length: daysFromPreviousMonth }, (_, i) => 
        subDays(monthStart, daysFromPreviousMonth - i)
      );
      days = [...previousDays, ...days];
    }
    
    // Add days from next month to complete the grid (6 rows x 7 columns = 42 cells)
    const remainingDays = 42 - days.length;
    if (remainingDays > 0) {
      const nextDays = Array.from({ length: remainingDays }, (_, i) => 
        addDays(monthEnd, i + 1)
      );
      days = [...days, ...nextDays];
    }
    
    return days;
  }, [currentMonth]);

  // Group appointments by date
  const appointmentsByDate = React.useMemo(() => {
    const result: Record<string, Appointment[]> = {};
    
    appointments.forEach(appointment => {
      const dateKey = format(appointment.date, 'yyyy-MM-dd');
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      result[dateKey].push(appointment);
    });
    
    return result;
  }, [appointments]);

  // Find appointments for selected day
  const selectedDayAppointments = React.useMemo(() => {
    const dateKey = format(selectedDay, 'yyyy-MM-dd');
    return appointmentsByDate[dateKey] || [];
  }, [selectedDay, appointmentsByDate]);

  // Handle month navigation
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Handle day click
  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    onDateSelect(day);
  };

  const isToday = (date: Date) => {
    const today = new Date(); 
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          {/* Month header with navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy', { locale: de })}
            </h2>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 text-center border-b">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="py-2 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 border-b">
            {calendarDays.map((day, index) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);
              const isSelected = isSameDay(day, selectedDay);
              const dayAppointments = appointmentsByDate[dateKey] || [];
              
              return (
                <div 
                  key={`${dateKey}-${index}`}
                  className={cn(
                    "min-h-[100px] border-r border-b p-1 relative cursor-pointer",
                    !isCurrentMonth && "bg-gray-50 text-gray-400",
                    isCurrentMonth && isTodayDate && "bg-green-50",
                    isCurrentMonth && isSelected && !isTodayDate && "bg-blue-50"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {/* Day number */}
                  <div className={cn(
                    "font-medium text-sm flex justify-between",
                    (isSelected || isTodayDate) && "font-bold"
                  )}>
                    <span className="p-0.5">{format(day, 'd')}</span>
                    {dayAppointments.length > 2 && (
                      <span className="text-xs text-gray-500 p-0.5">
                        +{dayAppointments.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Appointments */}
                  <div className="mt-1">
                    {dayAppointments.slice(0, 2).map((appointment) => (
                      <AppointmentHoverCard key={appointment.id} appointment={appointment}>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewAppointment) onViewAppointment(appointment.id);
                          }}
                          className={cn(
                            "text-xs mb-1 truncate rounded px-1.5 py-0.5 cursor-pointer",
                            appointment.color === "green" ? "bg-green-100 border-l-2 border-green-500" : 
                            appointment.color === "purple" ? "bg-purple-100 border-l-2 border-purple-500" : 
                            "bg-blue-100 border-l-2 border-blue-500",
                          )}
                        >
                          <span className="font-medium">{appointment.timeStart}</span> {appointment.title}
                        </div>
                      </AppointmentHoverCard>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              Nächsten Monat laden
            </Button>
          </div> */}
        </div>

        {/* Selected day appointments */}
        <div className="w-full md:w-1/3">
          <Card className="p-4">
            <h3 className="font-medium mb-2">
              {format(selectedDay, 'EEEE, dd. MMMM', { locale: de })}
              {isToday(selectedDay) && " (Heute)"}
            </h3>

            {selectedDayAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedDayAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className={cn(
                      "border p-2 rounded cursor-pointer hover:shadow-sm transition-shadow",
                      appointment.color === "green" ? "border-l-4 border-green-500" : 
                      appointment.color === "purple" ? "border-l-4 border-purple-500" : 
                      "border-l-4 border-blue-500"
                    )}
                    onClick={() => onViewAppointment && onViewAppointment(appointment.id)}
                  >
                    <div className="font-medium">{appointment.title}</div>
                    <div className="text-sm text-gray-600">
                      {appointment.timeStart} bis {appointment.timeEnd} Uhr
                    </div>
                    {appointment.location && (
                      <div className="text-sm text-gray-600">
                        {appointment.location}
                      </div>
                    )}
                    {appointment.details && appointment.details.map((detail, i) => (
                      <div key={i} className="text-sm text-gray-600">
                        {detail}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">Keine Termine an diesem Tag</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}