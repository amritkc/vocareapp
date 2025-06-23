"use client";

import React, { useState, useEffect, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { SlidersHorizontal, Plus, Database } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import DaySection from "./DaySelection";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import {
  getCalendarAppointments,
  getFilteredCalendarAppointments,
} from "@/utils/appointment-utils";
import { v4 as uuidv4 } from "uuid";
import { categories } from "@/database/seed-data";
import FilterDialog from "./FilterDialog";
import AppointmentForm from "./AppointmentForm";
import { dataSourceConfig } from "@/utils/config";

// Define appointment interface
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

// Define filter options interface
interface FilterOptions {
  category?: string;
  patient?: string;
  startDate?: Date;
  endDate?: Date;
}

// Define form data interface
interface AppointmentFormData {
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

function CalenderContain() {
  // Set initial date to current date - using the provided date
  const [date, setDate] = useState<Date>(new Date("2025-06-23"));
  const [view, setView] = useState<"liste" | "woche" | "monat">("liste");

  // Dialog states
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [appointmentFormMode, setAppointmentFormMode] = useState<
    "create" | "edit" | "view"
  >("create");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({});

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Data source toggle
  const [useMockData, setUseMockData] = useState(dataSourceConfig.useMockData);

  // Get initial appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Toggle data source
  useEffect(() => {
    dataSourceConfig.useMockData = useMockData;
    loadInitialData();
  }, [useMockData]);

  // Load initial data
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const appointmentsData = await getCalendarAppointments();
      setAppointments(appointmentsData as any);
      toast.success(useMockData ? "Mock-Daten geladen" : "API-Daten geladen", {
        description: useMockData
          ? "Die Anwendung verwendet jetzt Mock-Daten."
          : "Die Anwendung verwendet jetzt API-Daten.",
      });
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Fehler beim Laden der Daten", {
        description: "Bitte versuchen Sie es später erneut.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Apply filters to appointments
  useEffect(() => {
    const loadFilteredData = async () => {
      if (Object.keys(filters).length === 0) {
        // If filters are cleared, reload initial data
        loadInitialData();
        return;
      }

      setIsFilterLoading(true);
      try {
        const filteredAppointments = await getFilteredCalendarAppointments(
          filters
        );

        setAppointments(filteredAppointments as any);
      } catch (error) {
        console.error("Error applying filters:", error);
        toast.error("Fehler beim Filtern der Termine", {
          description: "Bitte versuchen Sie es später erneut.",
        });
      } finally {
        setIsFilterLoading(false);
      }
    };

    loadFilteredData();
  }, [filters]);

  // Group appointments by date for display in list view
  const groupedAppointments = useMemo(() => {
    return appointments.reduce<Record<string, Appointment[]>>(
      (groups, appointment) => {
        const dateKey = format(appointment.date, "yyyy-MM-dd");
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(appointment);
        return groups;
      },
      {}
    );
  }, [appointments]);

  // Current date and time - using the provided value
  const today = new Date();
  const currentDateTime = new Date();

  // Handle date selection
  const handleDateSelect = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  // Handle filter button click
  const handleFilter = () => {
    setFilterDialogOpen(true);
  };

  // Handle apply filters
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    toast.success("Filter angewendet", {
      description: "Die Termine wurden nach deinen Kriterien gefiltert.",
    });
  };

  // Handle new appointment button click
  const handleNewAppointment = () => {
    setAppointmentFormMode("create");
    setSelectedAppointment(null);
    setAppointmentDialogOpen(true);
  };

  // Handle view appointment
  const handleViewAppointment = (id: string) => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (appointment) {
      setSelectedAppointment(appointment);
      setAppointmentFormMode("view");
      setAppointmentDialogOpen(true);
    }
  };

  // Handle save appointment
  const handleSaveAppointment = async (formData: AppointmentFormData) => {
    try {
      if (appointmentFormMode === "create") {
        // Create new appointment - mock implementation
        const newAppointment: Appointment = {
          id: uuidv4(),
          title: formData.title,
          date: formData.date,
          timeStart: formData.startTime,
          timeEnd: formData.endTime,
          location: formData.location,
          details: [formData.notes],
          color:
            formData.category === categories[0]?.id
              ? "green"
              : formData.category === categories[1]?.id
              ? "purple"
              : "blue",
          patient: formData.patient,
          category: formData.category,
        };

        setAppointments([...appointments, newAppointment]);

        toast.success("Termin erstellt", {
          description: `Termin "${formData.title}" wurde erfolgreich erstellt.`,
        });
      } else if (appointmentFormMode === "edit" && selectedAppointment) {
        // Update existing appointment - mock implementation
        const updatedAppointments = appointments.map((apt) =>
          apt.id === selectedAppointment.id
            ? {
                ...apt,
                title: formData.title,
                date: formData.date,
                timeStart: formData.startTime,
                timeEnd: formData.endTime,
                location: formData.location,
                details: [formData.notes],
                color:
                  formData.category === categories[0]?.id
                    ? "green"
                    : formData.category === categories[1]?.id
                    ? "purple"
                    : "blue",
                patient: formData.patient,
                category: formData.category,
              }
            : apt
        );

        setAppointments(updatedAppointments);

        toast.success("Termin aktualisiert", {
          description: `Termin "${formData.title}" wurde erfolgreich aktualisiert.`,
        });
      }

      // Close the dialog
      setAppointmentDialogOpen(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("Fehler beim Speichern", {
        description:
          "Der Termin konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
      });
    }
  };

  // Map selected appointment to form data
  const getFormDataFromAppointment = (
    appointment: Appointment
  ): AppointmentFormData => {
    return {
      id: appointment.id,
      title: appointment.title,
      date: appointment.date,
      startTime: appointment.timeStart,
      endTime: appointment.timeEnd,
      location: appointment.location || "",
      notes: appointment.details ? appointment.details.join("\n") : "",
      category: appointment.category || "",
      patient: appointment.patient || "",
    };
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section with date picker, view switcher and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        {/* Date picker */}
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "dd MMMM yyyy", { locale: de })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                locale={de}
              />
            </PopoverContent>
          </Popover>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "liste" | "woche" | "monat")}
          >
            <TabsList>
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="woche">Woche</TabsTrigger>
              <TabsTrigger value="monat">Monat</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* View switcher and buttons */}
        <div className="flex items-center space-x-2">
          {/* Data Source Toggle */}
          {/* <div className="hidden sm:flex items-center mr-2 space-x-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {useMockData ? "Mock-Daten" : "API-Daten"}
            </span>
            <Switch
              checked={!useMockData}
              onCheckedChange={(checked) => setUseMockData(!checked)}
              aria-label="Datenquelle umschalten"
            />
          </div> */}
          <Button variant="outline" onClick={handleFilter}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Termine filtern</span>
            <span className="sm:hidden">Filtern</span>
          </Button>
          <Button onClick={handleNewAppointment}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Neuer Termin</span>
            <span className="sm:hidden">Neu</span>
          </Button>
        </div>
      </div>

      {/* Filter active indicator */}
      {(filters.category ||
        filters.patient ||
        filters.startDate ||
        filters.endDate) && (
        <div className="bg-blue-50 p-2 rounded-md mb-4 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">Filter aktiv:</span>
            {filters.category && <span className="ml-2">Kategorie</span>}
            {filters.patient && <span className="ml-2">Klient:in</span>}
            {filters.startDate && <span className="ml-2">Zeitraum</span>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
            Zurücksetzen
          </Button>
        </div>
      )}

      {/* Mobile Data Source Toggle */}
      {/* <div className="sm:hidden flex items-center mb-4 space-x-2 justify-center">
        <Database className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {useMockData ? "Mock-Daten" : "API-Daten"}
        </span>
        <Switch
          checked={!useMockData}
          onCheckedChange={(checked) => setUseMockData(!checked)}
          aria-label="Datenquelle umschalten"
        />
      </div> */}

      {/* Loading indicator */}
      {(isLoading || isFilterLoading) && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Calendar content based on selected view */}
      {!isLoading && (
        <Card className="bg-slate-50/50">
          <CardContent className={view === "liste" ? "p-6" : "p-0"}>
            {view === "liste" ? (
              <>
                <h3 className="text-base text-center text-gray-500 mb-6">
                  Termine vor dem {format(today, "dd.MM.yyyy")} laden
                </h3>

                {/* Render each day section */}
                {Object.entries(groupedAppointments).length > 0 ? (
                  Object.entries(groupedAppointments).map(
                    ([dateKey, dateAppointments]) => {
                      const appointmentDate = new Date(dateKey);
                      const isToday = isSameDay(today, appointmentDate);

                      return (
                        <DaySection
                          key={dateKey}
                          date={appointmentDate}
                          appointments={dateAppointments}
                          isToday={isToday}
                          onViewAppointment={handleViewAppointment}
                        />
                      );
                    }
                  )
                ) : (
                  <div className="text-center text-gray-500 mt-8 mb-8">
                    Keine Termine gefunden
                  </div>
                )}

                {Object.entries(groupedAppointments).length > 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    Keine weiteren Termine gefunden
                  </div>
                )}
              </>
            ) : view === "woche" ? (
              <>
                {/* Desktop week view */}
                <WeekView
                  appointments={appointments}
                  selectedDate={date}
                  currentDateTime={currentDateTime}
                  onViewAppointment={handleViewAppointment}
                />
              </>
            ) : (
              <>
                <MonthView
                  appointments={appointments}
                  selectedDate={date}
                  onDateSelect={handleDateSelect}
                  onViewAppointment={handleViewAppointment}
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="mt-4 text-center text-gray-500 text-sm">
        {view === "liste"
          ? "Termine als Liste"
          : view === "woche"
          ? "Kalender Wochenansicht"
          : "Kalender Monatsansicht"}
      </div>

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Appointment Form Dialog */}
      {appointmentDialogOpen && (
        <AppointmentForm
          isOpen={appointmentDialogOpen}
          onClose={() => setAppointmentDialogOpen(false)}
          onSave={handleSaveAppointment}
          initialData={
            selectedAppointment
              ? getFormDataFromAppointment(selectedAppointment)
              : undefined
          }
          mode={appointmentFormMode}
        />
      )}
    </div>
  );
}

export default CalenderContain;
