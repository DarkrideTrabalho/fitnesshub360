
// Vacation Types
export interface Vacation {
  id: string;
  user_id: string;
  teacher_name: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status?: string;
  createdAt: Date;
}

// Helper function to convert DB vacation to frontend format
export function convertDbVacationToFrontend(dbVacation: any): Vacation {
  return {
    id: dbVacation.id,
    user_id: dbVacation.user_id,
    teacher_name: dbVacation.teacher_name || 'Unknown Teacher',
    startDate: new Date(dbVacation.start_date),
    endDate: new Date(dbVacation.end_date),
    reason: dbVacation.reason,
    status: dbVacation.status,
    createdAt: new Date(dbVacation.created_at)
  };
}
