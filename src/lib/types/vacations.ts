
// Vacation Types
export interface Vacation {
  id: string;
  user_id: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status?: string;
  createdAt: Date;
}
