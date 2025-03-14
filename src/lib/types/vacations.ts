// Vacation types
export interface Vacation {
  id: string;
  teacherId: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  approved: boolean;
  createdAt: Date;
  // Compatibility with database fields
  teacher_id?: string;
  teacher_name?: string;
  start_date?: Date;
  end_date?: Date;
  created_at?: string;
}

// Function to convert database vacation format to application format
export function convertDbVacationToAppVacation(dbVacation: any): Vacation {
  return {
    id: dbVacation.id,
    teacherId: dbVacation.teacher_id || '',
    teacherName: dbVacation.teacher_name || '',
    startDate: new Date(dbVacation.start_date),
    endDate: new Date(dbVacation.end_date),
    reason: dbVacation.reason,
    approved: dbVacation.approved || false,
    createdAt: new Date(dbVacation.created_at),
    // Keep original fields for compatibility
    teacher_id: dbVacation.teacher_id,
    teacher_name: dbVacation.teacher_name,
    start_date: new Date(dbVacation.start_date),
    end_date: new Date(dbVacation.end_date),
    created_at: dbVacation.created_at
  };
}

// Mock vacations data
export const MOCK_VACATIONS: Vacation[] = [
  {
    id: 'v1',
    teacherId: '1',
    teacherName: 'John Smith',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-15'),
    reason: 'Family vacation',
    approved: true,
    createdAt: new Date()
  }
];
