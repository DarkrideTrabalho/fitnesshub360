
export interface Vacation {
  id: string;
  userId?: string;  // Maps to user_id in the database
  teacherId?: string;  // For client-side usage
  teacherName: string;
  startDate: Date;
  endDate: Date;
  approved?: boolean;  // Derived from status field
  reason?: string;
  status?: string;
}

// Export mock data (renamed to avoid conflict with mocks.ts)
export const VACATION_MOCKS: Vacation[] = [
  {
    id: 'v1',
    teacherId: 't1',
    userId: 't1',
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
    userId: 't2',
    teacherName: 'Maria Oliveira',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-24'),
    approved: true,
    status: 'approved',
    reason: 'Medical treatment'
  },
];
