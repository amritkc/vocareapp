"use client";

import dynamic from "next/dynamic";

const AppointmentHoverCard = dynamic(
  () => import("./AppointmentHoverCard"),
  { ssr: false }
);

interface ClientAppointmentHoverCardProps {
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

export default function ClientAppointmentHoverCard(props: ClientAppointmentHoverCardProps) {
  return <AppointmentHoverCard {...props} />;
}