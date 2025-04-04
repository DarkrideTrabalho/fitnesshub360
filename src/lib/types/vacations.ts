
export interface Vacation {
  id: string;
  teacherId?: string;  // Made optional since database uses user_id
  teacherName: string;
  startDate: Date;
  endDate: Date;
  approved?: boolean;  // Made optional to match status field usage
  reason?: string;
  status?: string;  // Added status field
  userId?: string;  // Added userId field to match DB structure
}

// Export mock data (renamed to avoid conflict with mocks.ts)
export const VACATION_MOCKS: Vacation[] = [
  {
    id: 'v1',
    teacherId: 't1',
    teacherName: 'João Silva',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-15'),
    approved: false,
    status: 'pending',
    reason: 'Summer vacation with family'
  },
  {
    id: 'v2',
    teacherId: 't2',
    teacherName: 'Maria Oliveira',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-24'),
    approved: true,
    status: 'approved',
    reason: 'Medical treatment'
  },
];
