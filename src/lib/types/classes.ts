// Fitness Class types
export interface FitnessClass {
  id: string;
  name: string;
  description: string;
  category: string;
  teacherId: string;
  teacherName: string;
  date: Date;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  enrolledCount: number;
  imageUrl?: string;
  
  // Database compatibility fields
  teacher_id?: string;
  start_time?: string;
  end_time?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Function to convert database class format to application format
export function convertDbClassToAppClass(dbClass: any): FitnessClass {
  return {
    id: dbClass.id,
    name: dbClass.name,
    description: dbClass.description || '',
    category: dbClass.category || '',
    teacherId: dbClass.teacher_id || '',
    teacherName: dbClass.teacher_name || '',
    date: new Date(dbClass.date),
    startTime: dbClass.start_time,
    endTime: dbClass.end_time,
    maxCapacity: dbClass.max_capacity || 0,
    enrolledCount: dbClass.enrolled_count || 0,
    imageUrl: dbClass.image_url,
    // Keep the original fields for compatibility
    teacher_id: dbClass.teacher_id,
    start_time: dbClass.start_time,
    end_time: dbClass.end_time,
    image_url: dbClass.image_url,
    created_at: dbClass.created_at,
    updated_at: dbClass.updated_at
  };
}

// Class Enrollment
export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  enrolledAt: Date;
  attended: boolean;
}

// Mock classes data
export const MOCK_CLASSES: FitnessClass[] = [
  {
    id: '7',
    name: 'Yoga for Beginners',
    description: 'A gentle introduction to yoga',
    category: 'Yoga',
    teacherId: '1',
    teacherName: 'John Smith',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    maxCapacity: 15,
    enrolledCount: 5,
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0'
  },
  {
    id: '8',
    name: 'Advanced Pilates',
    description: 'Challenging pilates class',
    category: 'Pilates',
    teacherId: '2',
    teacherName: 'Emily Johnson',
    date: new Date(),
    startTime: '17:00',
    endTime: '18:00',
    maxCapacity: 12,
    enrolledCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a'
  },
  {
    id: '9',
    name: 'Crossfit Level 2',
    description: 'Intense crossfit training',
    category: 'CrossFit',
    teacherId: '3',
    teacherName: 'Michael Brown',
    date: new Date(),
    startTime: '18:00',
    endTime: '19:00',
    maxCapacity: 10,
    enrolledCount: 10,
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5'
  },
];
