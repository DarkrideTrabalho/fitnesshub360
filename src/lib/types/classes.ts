
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
