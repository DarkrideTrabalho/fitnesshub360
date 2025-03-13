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

export const MOCK_TEACHERS = [
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

export const MOCK_STUDENTS = [
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.w@gmail.com',
    role: 'student',
    createdAt: new Date(),
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b82bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D'
  },
  {
    id: '5',
    name: 'David Jones',
    email: 'david.j@gmail.com',
    role: 'student',
    createdAt: new Date(),
    avatarUrl: 'https://images.unsplash.com/photo-1506794775853-9c5babc65e50?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D'
  },
  {
    id: '6',
    name: 'Linda Davis',
    email: 'linda.d@gmail.com',
    role: 'student',
    createdAt: new Date(),
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHw%3D'
  },
];

export const MOCK_CLASSES = [
  {
    id: '7',
    name: 'Yoga for Beginners',
    description: 'A gentle introduction to yoga',
    teacherId: '1',
    schedule: 'Mon, Wed, Fri at 9:00 AM',
    createdAt: new Date(),
  },
  {
    id: '8',
    name: 'Advanced Pilates',
    description: 'Challenging pilates class',
    teacherId: '2',
    schedule: 'Tue, Thu at 5:00 PM',
    createdAt: new Date(),
  },
  {
    id: '9',
    name: 'Crossfit Level 2',
    description: 'Intense crossfit training',
    teacherId: '3',
    schedule: 'Mon, Wed at 6:00 PM',
    createdAt: new Date(),
  },
];

export interface TeacherProfile extends User {
  role: 'teacher';
  specialties: string[];
  onVacation: boolean;
  vacationDates?: {
    start: Date;
    end: Date;
  };
}

export interface StudentProfile extends User {
  role: 'student';
}

export interface AdminProfile extends User {
  role: 'admin';
}

export type UserProfile = TeacherProfile | StudentProfile | AdminProfile;

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

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
