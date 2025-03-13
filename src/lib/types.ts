export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: Date;
  avatarUrl?: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  schedule: string;
  createdAt: Date;
}

// Extended user types
export interface Teacher extends User {
  role: 'teacher';
  specialties: string[];
  onVacation: boolean;
  vacationDates?: {
    start: Date;
    end: Date;
  };
}

export interface Student extends User {
  role: 'student';
  enrolledClasses?: string[];
  membershipType?: string;
  membershipStatus?: 'active' | 'overdue' | 'expired';
  taxNumber?: string;
  lastCheckIn?: Date;
}

export interface AdminProfile extends User {
  role: 'admin';
}

export type UserProfile = Teacher | Student | AdminProfile;

// Type for User Role
export type UserRole = 'admin' | 'teacher' | 'student';

// Fitness Class
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

// Enrollment
export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  enrolledAt: Date;
  attended: boolean;
}

// Vacation
export interface Vacation {
  id: string;
  teacherId: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  approved: boolean;
  createdAt: Date;
  teacher_id?: string;
  teacher_name?: string;
  start_date?: Date;
  end_date?: Date;
  created_at?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  user_id: string;
  read: boolean;
  created_at: string;
}

// Mock data
export const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.123@gmail.com',
    role: 'teacher',
    createdAt: new Date(),
    specialties: ['Yoga', 'Pilates'],
    onVacation: true,
    vacationDates: {
      start: new Date('2024-07-01'),
      end: new Date('2024-07-15'),
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd8b401e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D'
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily.fit@gmail.com',
    role: 'teacher',
    createdAt: new Date(),
    specialties: ['Cardio', 'Zumba'],
    onVacation: false,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@gmail.com',
    role: 'teacher',
    createdAt: new Date(),
    specialties: ['Weight Lifting', 'Crossfit'],
    onVacation: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741702-a0cfae58b707?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D'
  },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.w@gmail.com',
    role: 'student',
    createdAt: new Date(),
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b82bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D',
    enrolledClasses: []
  },
  {
    id: '5',
    name: 'David Jones',
    email: 'david.j@gmail.com',
    role: 'student',
    createdAt: new Date(),
    avatarUrl: 'https://images.unsplash.com/photo-1506794775853-9c5babc65e50?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D',
    enrolledClasses: []
  },
  {
    id: '6',
    name: 'Linda Davis',
    email: 'linda.d@gmail.com',
    role: 'student',
    createdAt: new Date(),
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D',
    enrolledClasses: []
  },
];

export const MOCK_USERS: User[] = [
  ...MOCK_TEACHERS,
  ...MOCK_STUDENTS,
  {
    id: '7',
    name: 'Admin User',
    email: 'admin@fitnesshub.com',
    role: 'admin',
    createdAt: new Date()
  }
];

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

// Language types
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  userId: string;
}
