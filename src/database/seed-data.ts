import { v4 as uuidv4 } from 'uuid';

// Categories table (used for appointment categorization)
export const categories = [
  {
    id: uuidv4(),
    created_at: new Date('2025-05-01T10:00:00Z'),
    updated_at: new Date('2025-05-01T10:00:00Z'),
    label: 'Medical',
    description: 'Medical appointments like doctor visits and treatments',
    color: 'green',
    icon: 'medical-bag'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-05-01T10:05:00Z'),
    updated_at: new Date('2025-05-01T10:05:00Z'),
    label: 'Care',
    description: 'Care service appointments like nursing or therapy',
    color: 'purple',
    icon: 'heart-pulse'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-05-01T10:10:00Z'),
    updated_at: new Date('2025-05-01T10:10:00Z'),
    label: 'Administrative',
    description: 'Administrative appointments like paperwork or insurance',
    color: 'blue',
    icon: 'file-document'
  }
];

// Patients table
export const patients = [
  {
    id: uuidv4(),
    created_at: new Date('2025-01-15T08:30:00Z'),
    firstname: 'Hans',
    lastname: 'Müller',
    birth_date: new Date('1948-05-22T00:00:00Z'),
    care_level: 3,
    pronoun: 'er/ihm',
    email: 'hans.mueller@example.com',
    active: true,
    active_since: new Date('2025-01-15T08:30:00Z')
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-02-10T09:15:00Z'),
    firstname: 'Greta',
    lastname: 'Schmidt',
    birth_date: new Date('1952-11-08T00:00:00Z'),
    care_level: 2,
    pronoun: 'sie/ihr',
    email: 'greta.schmidt@example.com',
    active: true,
    active_since: new Date('2025-02-10T09:15:00Z')
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-03-05T14:45:00Z'),
    firstname: 'Klaus',
    lastname: 'Weber',
    birth_date: new Date('1942-08-17T00:00:00Z'),
    care_level: 4,
    pronoun: 'er/ihm',
    email: 'klaus.weber@example.com',
    active: true,
    active_since: new Date('2025-03-05T14:45:00Z')
  }
];

// Relatives table (connected to patients)
export const relatives = [
  {
    id: uuidv4(),
    created_at: new Date('2025-01-15T08:35:00Z'),
    pronoun: 'sie/ihr',
    firstname: 'Helga',
    lastname: 'Müller',
    notes: 'Tochter von Hans Müller, Hauptkontaktperson',
    patient_id: patients[0].id // Reference to Hans Müller
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-02-10T09:20:00Z'),
    pronoun: 'er/ihm',
    firstname: 'Thomas',
    lastname: 'Schmidt',
    notes: 'Sohn von Greta Schmidt, erreichbar am Wochenende',
    patient_id: patients[1].id // Reference to Greta Schmidt
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-03-05T14:50:00Z'),
    pronoun: 'sie/ihr',
    firstname: 'Anna',
    lastname: 'Weber',
    notes: 'Enkelin von Klaus Weber, arbeitet als Krankenschwester',
    patient_id: patients[2].id // Reference to Klaus Weber
  }
];

// Appointments table
export const appointments = [
  {
    id: uuidv4(),
    created_at: new Date('2025-06-01T09:00:00Z'),
    updated_at: new Date('2025-06-01T09:00:00Z'),
    start: new Date('2025-06-23T08:45:00Z'),
    end: new Date('2025-06-23T09:30:00Z'),
    location: 'Praxis von Frau Dr. med. Mustermann',
    patient: patients[0].id, // Hans Müller
    attachments: 'versicherungskarte.pdf',
    category: categories[0].id, // Medical
    notes: 'Regelmäßige Kontrolle',
    title: 'Arzt-Termin'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-06-05T11:30:00Z'),
    updated_at: new Date('2025-06-05T11:30:00Z'),
    start: new Date('2025-06-24T12:30:00Z'),
    end: new Date('2025-06-24T17:30:00Z'),
    location: 'Bei Herr Musterpatienti zuhause',
    patient: patients[1].id, // Greta Schmidt
    attachments: 'pflegemappe.pdf',
    category: categories[1].id, // Care
    notes: 'Pflegemappe soll vorort dabei sein',
    title: 'MDK Besuch - Mögliche Erhöhung des Pflegegrad'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-06-10T14:00:00Z'),
    updated_at: new Date('2025-06-10T14:00:00Z'),
    start: new Date('2025-06-30T10:00:00Z'),
    end: new Date('2025-06-30T11:00:00Z'),
    location: 'Büro der Pflegeversicherung',
    patient: patients[2].id, // Klaus Weber
    attachments: 'antragsformulare.pdf',
    category: categories[2].id, // Administrative
    notes: 'Vollmacht mitbringen',
    title: 'Beratungsgespräch zur Pflegeversicherung'
  }
];

// Users (can be appointment assignees)
export const users = [
  {
    id: uuidv4(),
    name: 'Sarah Krankenschwester',
    email: 'sarah@pflegedienst-example.de',
    role: 'nurse'
  },
  {
    id: uuidv4(),
    name: 'Michael Pflegehelfer',
    email: 'michael@pflegedienst-example.de',
    role: 'care_assistant'
  },
  {
    id: uuidv4(),
    name: 'Julia Verwaltung',
    email: 'julia@pflegedienst-example.de',
    role: 'administrative'
  }
];

// Appointment_assignee table (junction table between appointments and users)
export const appointment_assignee = [
  {
    id: uuidv4(),
    created_at: new Date('2025-06-01T09:05:00Z'),
    appointment: appointments[0].id,
    user: users[0].id, // Sarah is assigned to the first appointment
    user_type: 'begleitung'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-06-05T11:35:00Z'),
    appointment: appointments[1].id,
    user: users[1].id, // Michael is assigned to the second appointment
    user_type: 'hauptverantwortlich'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-06-10T14:05:00Z'),
    appointment: appointments[2].id,
    user: users[2].id, // Julia is assigned to the third appointment
    user_type: 'verwaltung'
  }
];

// Activities related to appointments
export const activities = [
  {
    id: uuidv4(),
    created_at: new Date('2025-06-01T09:10:00Z'),
    created_by: users[0].id, // Created by Sarah
    appointment: appointments[0].id,
    type: 'note',
    content: 'Patientenakte aktualisiert und Termin bestätigt'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-06-05T11:40:00Z'),
    created_by: users[1].id, // Created by Michael
    appointment: appointments[1].id,
    type: 'document',
    content: 'Pflegemappe für MDK Besuch vorbereitet'
  },
  {
    id: uuidv4(),
    created_at: new Date('2025-06-10T14:10:00Z'),
    created_by: users[2].id, // Created by Julia
    appointment: appointments[2].id,
    type: 'reminder',
    content: 'Erinnerung: Vollmacht für Beratungsgespräch benötigt'
  }
];

// Full database object with references
export const database = {
  categories,
  patients,
  relatives,
  appointments,
  users,
  appointment_assignee,
  activities
};