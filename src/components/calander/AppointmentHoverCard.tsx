"use client";

import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { categories, patients } from "@/database/seed-data";

interface AppointmentHoverCardProps {
  appointment: {
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
  };
  children: React.ReactNode;
}

export function AppointmentHoverCard({
  appointment,
  children,
}: AppointmentHoverCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Find patient info
  const patient = appointment.patient
    ? patients.find((p) => p.id === appointment.patient)
    : undefined;

  // Find category info
  const category = appointment.category
    ? categories.find((c) => c.id === appointment.category)
    : undefined;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      {mounted && (
        <HoverCardContent className="w-80 p-4" align="start">
          <div className="space-y-2">
            {/* Title with colored border */}
            <div
              className={cn(
                "font-medium border-l-4 -ml-4 pl-3 py-1",
                appointment.color === "green"
                  ? "border-green-500"
                  : appointment.color === "purple"
                  ? "border-purple-500"
                  : "border-blue-500"
              )}
            >
              {appointment.title}
            </div>

            {/* Date */}
            <div className="flex items-center text-sm">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {format(appointment.date, "EEEE, dd. MMMM yyyy", {
                  locale: de,
                })}
              </span>
            </div>

            {/* Time */}
            <div className="text-sm pl-6">
              {appointment.timeStart} - {appointment.timeEnd} Uhr
            </div>

            {/* Location */}
            {appointment.location && (
              <div className="flex items-center text-sm">
                <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{appointment.location}</span>
              </div>
            )}

            {/* Patient */}
            {patient && (
              <div className="flex items-center text-sm">
                <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {patient.firstname} {patient.lastname}
                </span>
              </div>
            )}

            {/* Category */}
            {category && (
              <div className="mt-2 text-xs px-2 py-1 rounded-full bg-gray-100 inline-block">
                {category.label}
              </div>
            )}

            {/* Details/Notes */}
            {appointment.details && appointment.details.length > 0 && (
              <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                {appointment.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            )}
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

export default AppointmentHoverCard;
