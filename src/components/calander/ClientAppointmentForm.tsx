"use client";

import dynamic from "next/dynamic";

const AppointmentForm = dynamic(
  () => import("./AppointmentForm"),
  { ssr: false }
);

export interface AppointmentFormData {
  id?: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
  category: string;
  patient: string;
}

interface ClientAppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: AppointmentFormData) => void;
  initialData?: AppointmentFormData;
  mode: "create" | "edit" | "view";
}

export default function ClientAppointmentForm(props: ClientAppointmentFormProps) {
  return <AppointmentForm {...props} />;
}