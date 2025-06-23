"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { categories, patients } from "@/database/seed-data";

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  category?: string;
  patient?: string;
  startDate?: Date;
  endDate?: Date;
}

export function FilterDialog({ isOpen, onClose, onApplyFilters }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleApplyFilters = () => {
    onApplyFilters({
      ...filters,
      startDate,
      endDate
    });
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({});
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // For Categories Select
  const handleCategoryChange = (value: string) => {
    setFilters({ 
      ...filters, 
      category: value === "all" ? undefined : value 
    });
  };

  // For Patients Select
  const handlePatientChange = (value: string) => {
    setFilters({ 
      ...filters, 
      patient: value === "all" ? undefined : value 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Termine filtern</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Category filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Kategorie
            </Label>
            <Select
              value={filters.category || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Alle Kategorien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Patient filter */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient" className="text-right">
              Klient:in
            </Label>
            <Select
              value={filters.patient || "all"}
              onValueChange={handlePatientChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Alle Klient:innen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Klient:innen</SelectItem>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.firstname} {patient.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Zeitraum</Label>
            <div className="col-span-3 space-x-2">
              {/* Start date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "dd.MM.yyyy", { locale: de })
                    ) : (
                      <span>Startdatum</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={de}
                  />
                </PopoverContent>
              </Popover>

              {/* End date */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "dd.MM.yyyy", { locale: de })
                    ) : (
                      <span>Enddatum</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      startDate ? date < startDate : false
                    }
                    initialFocus
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleResetFilters}>
            Zurücksetzen
          </Button>
          <Button onClick={handleApplyFilters}>Anwenden</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FilterDialog;