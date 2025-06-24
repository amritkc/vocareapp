"use client";

import React, { useMemo, useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { AppointmentHoverCard } from "./AppointmentHoverCard";

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

interface WeekViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  currentDateTime?: Date; 
  onViewAppointment?: (id: string) => void;
}

// Convert HH:MM string to minutes since midnight
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes since midnight to top position in pixels
const minutesToPosition = (minutes: number) => {
  return (minutes / (24 * 60)) * 1440; 
};

export function WeekView({ 
  appointments, 
  selectedDate, 
  currentDateTime = new Date(), 
  onViewAppointment
}: WeekViewProps) {
  // State for real-time current time updates
  const [displayTime, setDisplayTime] = useState(currentDateTime);
  const [displayTimeText, setDisplayTimeText] = useState("");
  
  // Initialize and update the time
  useEffect(() => {
    const updateTimeDisplay = () => {
      const now = isSameDay(new Date(), new Date()) 
        ? new Date() 
        : currentDateTime;
      
      setDisplayTime(now);
      setDisplayTimeText(format(now, 'HH:mm'));
    };
    
    // Initial update
    updateTimeDisplay();
    
    // Set interval for updates
    const intervalId = setInterval(updateTimeDisplay, 60000); 
    
    return () => clearInterval(intervalId);
  }, [currentDateTime]);

  // Generate an array of dates for the current week
  const weekDates = useMemo(() => {
    const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); 
    return Array(7)
      .fill(null)
      .map((_, i) => addDays(startDate, i));
  }, [selectedDate]);

  // Create time slots
  const timeSlots = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i);
  }, []);

  // Current time indicator position - updates when displayTime changes
  const currentTimePosition = useMemo(() => {
    const hours = displayTime.getHours();
    const minutes = displayTime.getMinutes();
    return minutesToPosition(hours * 60 + minutes);
  }, [displayTime]);

  // Check if a date is today
  const isToday = (date: Date) => {
    return isSameDay(date, currentDateTime);
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with dates */}
        <div className="flex border-b">
          <div className="w-16 flex-shrink-0"></div>
          {weekDates.map((date) => (
            <div 
              key={format(date, 'yyyy-MM-dd')} 
              className={cn(
                "flex-1 px-2 py-3 text-center border-l",
                isSameDay(date, selectedDate) && "bg-blue-50",
                isToday(date) && "bg-green-50"
              )}
            >
              <div className="flex items-center justify-center gap-1">
                <div className="font-medium">{format(date, 'EEEE', { locale: de })}</div>
                {isToday(date) && (
                  <div className="text-xs text-green-600">(Heute)</div>
                )}
              </div>
              <div className="text-sm">{format(date, 'dd. MMM', { locale: de })}</div>
            </div>
          ))}
        </div>

        {/* Time slots grid */}
        <div className="relative" style={{ height: '1440px' }}> 
          {/* Time labels */}
          <div className="absolute top-0 left-0 w-16 h-full">
            {timeSlots.map((hour) => (
              <div 
                key={hour} 
                className="absolute w-full border-t flex items-center justify-center"
                style={{ top: `${hour * 60}px`, height: '60px' }}
              >
                <span className="text-xs text-gray-500">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Day columns with grid lines */}
          <div className="absolute left-16 right-0 top-0 h-full flex">
            {weekDates.map((date) => (
              <div 
                key={format(date, 'yyyy-MM-dd')} 
                className={cn(
                  "flex-1 border-l relative",
                  isSameDay(date, selectedDate) && "bg-blue-50",
                  isToday(date) && "bg-green-50"
                )}
              >
                {/* Hour grid lines */}
                {timeSlots.map((hour) => (
                  <div 
                    key={hour} 
                    className="absolute w-full border-t"
                    style={{ top: `${hour * 60}px` }}
                  />
                ))}

                {/* Appointments for this day */}
                {appointments.filter(apt => 
                  isSameDay(apt.date, date)
                ).map((appointment) => {
                  const startMinutes = timeToMinutes(appointment.timeStart);
                  const endMinutes = timeToMinutes(appointment.timeEnd);
                  const duration = endMinutes - startMinutes;
                  
                  return (
                    <AppointmentHoverCard key={appointment.id} appointment={appointment}>
                      <div
                        className={cn(
                          "absolute rounded-sm mx-1 px-2 py-1 shadow-sm cursor-pointer",
                          appointment.color === "green" ? "bg-green-100 border-l-4 border-green-500" : 
                          appointment.color === "purple" ? "bg-purple-100 border-l-4 border-purple-500" : 
                          "bg-blue-100 border-l-4 border-blue-500"
                        )}
                        style={{
                          top: `${minutesToPosition(startMinutes)}px`,
                          height: `${duration / (24 * 60) * 1440}px`, 
                          left: '4px',
                          right: '4px',
                          minHeight: '25px', 
                        }}
                        onClick={() => onViewAppointment && onViewAppointment(appointment.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="overflow-hidden">
                            <div className="font-medium text-xs truncate">{appointment.title}</div>
                            <div className="text-xs text-gray-500">
                              {appointment.timeStart} - {appointment.timeEnd}
                            </div>
                            {appointment.location && (
                              <div className="text-xs text-gray-500 truncate max-w-full">
                                {appointment.location}
                              </div>
                            )}
                          </div>
                          <Checkbox className="h-3 w-3" />
                        </div>
                      </div>
                    </AppointmentHoverCard>
                  );
                })}
              </div>
            ))}
          </div>
          {weekDates.some(date => isToday(date)) && (
            <div 
              className="absolute left-0 right-0 z-10 flex items-center"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="w-16 pr-2 flex justify-end items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-red-500 font-medium whitespace-nowrap">
                  {displayTimeText}
                </span>
              </div>
              <div className="flex-grow h-px bg-red-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeekView;