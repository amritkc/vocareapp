import { supabase } from './supabase';
import type { Database } from './database.types';
import { v4 as uuidv4 } from 'uuid';

// Type aliases for better readability
type AppointmentRow = Database['public']['Tables']['appointments']['Row'];
type PatientRow = Database['public']['Tables']['patients']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type AppointmentAssigneeRow = Database['public']['Tables']['appointment_assignee']['Row'];
type ActivityRow = Database['public']['Tables']['activities']['Row'];

// Appointment API
export const appointmentsApi = {
  // Get all appointments
  async getAll(): Promise<AppointmentRow[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*');
      
    if (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Get appointments with filters
  async getFiltered(filters: {
    patientId?: string;
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AppointmentRow[]> {
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
      console.error('Error fetching filtered appointments:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Get appointment by ID
  async getById(id: string): Promise<AppointmentRow | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }
    
    return data;
  },
  
  // Create appointment
  async create(appointment: Omit<AppointmentRow, 'id' | 'created_at' | 'updated_at'>): Promise<AppointmentRow | null> {
    const now = new Date().toISOString();
    const newAppointment = {
      ...appointment,
      id: uuidv4(),
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(newAppointment)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating appointment:', error);
      return null;
    }
    
    return data;
  },
  
  // Update appointment
  async update(id: string, updates: Partial<AppointmentRow>): Promise<AppointmentRow | null> {
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
      console.error('Error updating appointment:', error);
      return null;
    }
    
    return data;
  }
};

// Patients API
export const patientsApi = {
  // Get all patients
  async getAll(): Promise<PatientRow[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
      
    if (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
    
    return data || [];
  }
};

// Categories API
export const categoriesApi = {
  // Get all categories
  async getAll(): Promise<CategoryRow[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
      
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
  }
};

// Appointment Assignee API
export const appointmentAssigneeApi = {
  // Create assignment
  async create(assignee: Omit<AppointmentAssigneeRow, 'id' | 'created_at'>): Promise<AppointmentAssigneeRow | null> {
    const { data, error } = await supabase
      .from('appointment_assignee')
      .insert({
        ...assignee,
        id: uuidv4(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating appointment assignee:', error);
      return null;
    }
    
    return data;
  }
};

// Activities API
export const activitiesApi = {
  // Create activity
  async create(activity: Omit<ActivityRow, 'id' | 'created_at'>): Promise<ActivityRow | null> {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        ...activity,
        id: uuidv4(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating activity:', error);
      return null;
    }
    
    return data;
  }
};