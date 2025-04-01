
// Vacation Types
export interface Vacation {
  id: string;
  teacherId: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  approved: boolean;
  createdAt: Date;
}
