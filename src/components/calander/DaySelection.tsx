"use client";

import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
}

interface DaySectionProps {
  date: Date;
  appointments: Appointment[];
  isToday: boolean;
  onViewAppointment?: (id: string) => void;
}

function DaySection({ date, appointments, isToday, onViewAppointment }: DaySectionProps) {
  // Sort appointments by start time
  const sortedAppointments = [...appointments].sort((a, b) => 
    a.timeStart.localeCompare(b.timeStart)
  );

  return (
    <div className="mb-6">
      {/* Day header */}
      <div className="flex items-center mb-2">
        <div className="flex-grow">
          <h2 className="font-medium">
            {format(date, "EEEE, dd. MMMM yyyy", { locale: de })}
            {isToday && <span className="ml-2 text-green-600">(Heute)</span>}
          </h2>
        </div>
      </div>

      {/* Appointments list */}
      <div className="space-y-2">
        {sortedAppointments.map((appointment) => (
          <AppointmentHoverCard key={appointment.id} appointment={appointment}>
            <div 
              className={cn(
                "p-3 rounded-md border cursor-pointer hover:shadow-md transition-shadow",
                appointment.color === "green" ? "border-l-4 border-green-500" : 
                appointment.color === "purple" ? "border-l-4 border-purple-500" : 
                "border-l-4 border-blue-500"
              )}
              onClick={() => onViewAppointment && onViewAppointment(appointment.id)}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{appointment.title}</h3>
                <div className="text-sm text-gray-500">
                  {appointment.timeStart} - {appointment.timeEnd}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {appointment.location}
              </div>
            </div>
          </AppointmentHoverCard>
        ))}

        {sortedAppointments.length === 0 && (
          <p className="text-gray-500 py-2 text-center">
            Keine Termine an diesem Tag
          </p>
        )}
      </div>
    </div>
  );
}

export default DaySection;