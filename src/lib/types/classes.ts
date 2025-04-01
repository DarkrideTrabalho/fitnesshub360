
// Class Types
export interface FitnessClass {
  id: string;
  name: string;
  description?: string;
  category: string;
  teacherId: string;
  teacherName: string;
  date: Date;
  startTime: string;  // Format HH:MM
  endTime: string;    // Format HH:MM
  maxCapacity: number;
  enrolledCount: number;
  imageUrl?: string;
}

export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  enrolledAt: Date;
  attended: boolean;
}

// Helper function to convert database class format to FitnessClass
export function convertDbClassToFitnessClass(dbClass: any): FitnessClass {
  return {
    id: dbClass.id,
    name: dbClass.name,
    description: dbClass.description,
    category: dbClass.category,
    teacherId: dbClass.teacher_id,
    teacherName: dbClass.teacher_name || "Unknown Teacher",
    date: new Date(dbClass.date),
    startTime: dbClass.start_time,
    endTime: dbClass.end_time,
    maxCapacity: dbClass.max_capacity,
    enrolledCount: dbClass.enrolled_count,
    imageUrl: dbClass.image_url
  };
}
