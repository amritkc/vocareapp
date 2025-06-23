import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface AppointmentProps {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  location?: string;
  details?: string[];
  color: string;
}

function AppointmentCard({
  title,
  timeStart,
  timeEnd,
  location,
  details,
  color,
}: AppointmentProps) {
  return (
    <div className="bg-white border rounded-md mb-3 shadow-sm">
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div
            className={`w-1 h-full min-h-[30px] rounded-full ${
              color === "green"
                ? "bg-green-500"
                : color === "purple"
                ? "bg-purple-500"
                : "bg-blue-500"
            }`}
          />
          <div className="flex-1">
            <div className="font-medium">{title}</div>
            <div className="text-sm text-gray-500">
              {timeStart} bis {timeEnd} Uhr
            </div>
            {location && <div className="text-sm text-gray-500">{location}</div>}
            {details &&
              details.map((detail, i) => (
                <div key={i} className="text-sm text-gray-500">
                  {detail}
                </div>
              ))}
          </div>
        </div>
        <Checkbox />
      </div>
    </div>
  );
}

export default AppointmentCard;