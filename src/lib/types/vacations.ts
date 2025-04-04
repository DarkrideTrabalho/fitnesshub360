
export interface Vacation {
  id: string;
  teacherId: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  approved: boolean;
  reason?: string;
}

export const MOCK_VACATIONS: Vacation[] = [
  {
    id: 'v1',
    teacherId: 't1',
    teacherName: 'João Silva',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-15'),
    approved: false,
    reason: 'Summer vacation with family'
  },
  {
    id: 'v2',
    teacherId: 't2',
    teacherName: 'Maria Oliveira',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-24'),
    approved: true,
    reason: 'Medical treatment'
  },
];
