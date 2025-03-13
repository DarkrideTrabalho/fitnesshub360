
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: Date;
  avatarUrl?: string;
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

// Mock users data
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
