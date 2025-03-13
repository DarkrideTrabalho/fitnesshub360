
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
