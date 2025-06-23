import { appointments as mockAppointments, patients as mockPatients, categories as mockCategories } from '../database/seed-data';
import { dataSourceConfig } from './config';
import { supabase } from '../lib/supabase';

// Const for the current date and time
export const CURRENT_DATE_TIME = new Date("2025-06-23 11:07:48");
export const CURRENT_USER = "amrit-khadka04";

export interface CalendarAppointment {
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

// Function to convert API appointment to CalendarAppointment
function convertApiAppointmentToCalendarAppointment(
  appointment: any,
  patients: any[],
  categories: any[]
): CalendarAppointment {
  // Find the patient
  const patient = patients.find(p => p.id === appointment.patient);
  
  // Find the category
  const category = categories.find(c => c.id === appointment.category);
  
  // Extract time from ISO date string
  const startDate = new Date(appointment.start);
  const endDate = new Date(appointment.end);
  const startTime = startDate.toTimeString().substring(0, 5);
  const endTime = endDate.toTimeString().substring(0, 5);
  
  // Format details
  const details = [];
  if (patient) {
    details.push(`Patient: ${patient.firstname} ${patient.lastname}`);
  }
  if (appointment.notes) {
    details.push(appointment.notes);
  }
  
  return {
    id: appointment.id,
    title: appointment.title,
    date: startDate,
    timeStart: startTime,
    timeEnd: endTime,
    location: appointment.location,
    details: details.length > 0 ? details : undefined,
    color: category?.color?.replace('#', '') || 'blue',
    patient: appointment.patient,
    category: appointment.category
  };
}

// Get calendar appointments from mock data
export function getMockCalendarAppointments(): CalendarAppointment[] {
  return mockAppointments.map(appointment => {
    return convertApiAppointmentToCalendarAppointment(
      appointment, 
      mockPatients, 
      mockCategories
    );
  });
}

// API client functions using Supabase
const apiClient = {
  appointments: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error("Error calling appointments.getAll API:", error);
        return null;
      }
    },
    
    async getFiltered(filters: {
      patientId?: string;
      categoryId?: string;
      startDate?: Date;
      endDate?: Date;
    }) {
      try {
        let query = supabase.from('appointments').select('*');
        
        if (filters.patientId && filters.patientId !== 'all') {
          query = query.eq('patient', filters.patientId);
        }
        
        if (filters.categoryId && filters.categoryId !== 'all') {
          query = query.eq('category', filters.categoryId);
        }
        
        if (filters.startDate) {
          query = query.gte('start', filters.startDate.toISOString());
        }
        
        if (filters.endDate) {
          const endDateWithTime = new Date(filters.endDate);
          endDateWithTime.setHours(23, 59, 59, 999);
          query = query.lte('start', endDateWithTime.toISOString());
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error("Error calling appointments.getFiltered API:", error);
        return null;
      }
    },
    
    async create(appointment: any) {
      try {
        const newAppointment = {
          ...appointment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('appointments')
          .insert(newAppointment)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error creating appointment:", error);
        return null;
      }
    },
    
    async update(id: string, updates: any) {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error updating appointment:", error);
        return null;
      }
    },
    
    async delete(id: string) {
      try {
        const { error } = await supabase
          .from('appointments')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        return true;
      } catch (error) {
        console.error("Error deleting appointment:", error);
        return null;
      }
    }
  },
  
  patients: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error("Error calling patients.getAll API:", error);
        return null;
      }
    }
  },
  
  categories: {
    async getAll() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error("Error calling categories.getAll API:", error);
        return null;
      }
    }
  },
  
  activities: {
    async create(activity: any) {
      try {
        const { data, error } = await supabase
          .from('activities')
          .insert({
            ...activity,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error creating activity:", error);
        return null;
      }
    }
  },
  
  appointmentAssignees: {
    async create(assignee: any) {
      try {
        const { data, error } = await supabase
          .from('appointment_assignee')
          .insert({
            ...assignee,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error creating appointment assignee:", error);
        return null;
      }
    }
  }
};

// Get calendar appointments 
export async function getCalendarAppointments(): Promise<CalendarAppointment[] | null> {
  // If mock data is enabled, return it immediately
  if (dataSourceConfig.useMockData) {
    console.log('Using mock appointment data');
    return getMockCalendarAppointments();
  }
  
  // Call the real API - handle any null results or errors
  try {
    const appointments = await apiClient.appointments.getAll();
    
    if (appointments === null) {
      console.log('No appointments returned from API');
      return null;
    }
    
    const patients = await apiClient.patients.getAll();
    const categories = await apiClient.categories.getAll();
    
    if (patients === null) {
      console.log('No patients returned from API');
      return null;
    }
    
    if (categories === null) {
      console.log('No categories returned from API');
      return null;
    }
    
    return appointments.map((appointment: any) => {
      return convertApiAppointmentToCalendarAppointment(
        appointment, 
        patients, 
        categories
      );
    });
  } catch (error) {
    console.error('Unexpected error in getCalendarAppointments:', error);
    return null;
  }
}

// Get filtered calendar appointments
export async function getFilteredCalendarAppointments(filters: {
  patientId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<CalendarAppointment[] | null> {
  // If mock data is enabled, filter and return it immediately
  if (dataSourceConfig.useMockData) {
    console.log('Using filtered mock appointment data');
    let filteredMockAppointments = mockAppointments;
    
    if (filters.patientId && filters.patientId !== 'all') {
      filteredMockAppointments = filteredMockAppointments.filter(a => a.patient === filters.patientId);
    }
    
    if (filters.categoryId && filters.categoryId !== 'all') {
      filteredMockAppointments = filteredMockAppointments.filter(a => a.category === filters.categoryId);
    }
    
    if (filters.startDate) {
      filteredMockAppointments = filteredMockAppointments.filter(a => new Date(a.start) >= filters.startDate!);
    }
    
    if (filters.endDate) {
      const endDateWithTime = new Date(filters.endDate);
      endDateWithTime.setHours(23, 59, 59, 999);
      filteredMockAppointments = filteredMockAppointments.filter(a => new Date(a.start) <= endDateWithTime);
    }
    
    return filteredMockAppointments.map(appointment => {
      return convertApiAppointmentToCalendarAppointment(
        appointment, 
        mockPatients, 
        mockCategories
      );
    });
  }
  
  // Call the real API - handle any null results or errors
  try {
    const appointments = await apiClient.appointments.getFiltered(filters);
    
    if (appointments === null) {
      console.log('No filtered appointments returned from API');
      return null;
    }
    
    const patients = await apiClient.patients.getAll();
    const categories = await apiClient.categories.getAll();
    
    if (patients === null) {
      console.log('No patients returned from API');
      return null;
    }
    
    if (categories === null) {
      console.log('No categories returned from API');
      return null;
    }
    
    return appointments.map((appointment: any) => {
      return convertApiAppointmentToCalendarAppointment(
        appointment, 
        patients, 
        categories
      );
    });
  } catch (error) {
    console.error('Unexpected error in getFilteredCalendarAppointments:', error);
    return null;
  }
}

// Create appointment
export async function createAppointment(appointmentData: any): Promise<any> {
  if (dataSourceConfig.useMockData) {
    console.log('Using mock data - appointment creation simulated');
    return {
      ...appointmentData,
      id: 'mock-id-' + Date.now()
    };
  }
  
  try {
    return await apiClient.appointments.create(appointmentData);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return null;
  }
}

// Update appointment
export async function updateAppointment(id: string, updates: any): Promise<any> {
  if (dataSourceConfig.useMockData) {
    console.log('Using mock data - appointment update simulated');
    return {
      ...updates,
      id
    };
  }
  
  try {
    return await apiClient.appointments.update(id, updates);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return null;
  }
}

// Delete appointment
export async function deleteAppointment(id: string): Promise<boolean> {
  if (dataSourceConfig.useMockData) {
    console.log('Using mock data - appointment deletion simulated');
    return true;
  }
  
  try {
    return await apiClient.appointments.delete(id) || false;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
}

// Create activity
export async function createActivity(activityData: any): Promise<any> {
  if (dataSourceConfig.useMockData) {
    console.log('Using mock data - activity creation simulated');
    return {
      ...activityData,
      id: 'mock-id-' + Date.now()
    };
  }
  
  try {
    return await apiClient.activities.create(activityData);
  } catch (error) {
    console.error('Error creating activity:', error);
    return null;
  }
}

// Create appointment assignee
export async function createAppointmentAssignee(assigneeData: any): Promise<any> {
  if (dataSourceConfig.useMockData) {
    console.log('Using mock data - appointment assignee creation simulated');
    return {
      ...assigneeData,
      id: 'mock-id-' + Date.now()
    };
  }
  
  try {
    return await apiClient.appointmentAssignees.create(assigneeData);
  } catch (error) {
    console.error('Error creating appointment assignee:', error);
    return null;
  }
}