"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { categories, patients } from "@/database/seed-data";

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: AppointmentFormData) => void;
  initialData?: AppointmentFormData;
  mode: "create" | "edit" | "view";
  onDelete?: () => void;
  onEdit?: () => void;
}

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

export function AppointmentForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: AppointmentFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    notes: "",
    category: "",
    patient: "",
  });

  const isViewMode = mode === "view";

  // Only render on client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize form data with the provided initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof AppointmentFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // Don't render until client-side
  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Neuer Termin"
              : mode === "edit"
              ? "Termin bearbeiten"
              : "Termin details"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titel
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="col-span-3"
              disabled={isViewMode}
            />
          </div>

          {/* Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Datum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`col-span-3 justify-start text-left font-normal ${
                    isViewMode ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={isViewMode}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date
                    ? format(formData.date, "dd.MM.yyyy", { locale: de })
                    : "Datum auswählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && handleChange("date", date)}
                  initialFocus
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Zeit</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  disabled={isViewMode}
                />
              </div>
              <div className="flex items-center">
                <span className="mx-2">bis</span>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Ort
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="col-span-3"
              disabled={isViewMode}
            />
          </div>

          {/* Patient */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient" className="text-right">
              Klient:in
            </Label>
            <Select
              value={formData.patient}
              onValueChange={(value) => handleChange("patient", value)}
              disabled={isViewMode}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Klient:in auswählen" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.firstname} {patient.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Kategorie
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
              disabled={isViewMode}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right self-start pt-2">
              Notizen
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="col-span-3"
              rows={3}
              disabled={isViewMode}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isViewMode ? "Schließen" : "Abbrechen"}
          </Button>
          {!isViewMode && (
            <Button onClick={handleSave}>
              {mode === "create" ? "Erstellen" : "Speichern"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentForm;
