export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  avatarUrl?: string;
}

export interface Teacher extends User {
  specialties: string[];
  onVacation: boolean;
  vacationDates?: {
    start: Date;
    end: Date;
  };
}

export interface Student extends User {
  membershipType: string;
  lastCheckIn?: Date;
  enrolledClasses: string[];
  taxNumber?: string;
  phoneNumber?: string;
  membershipStatus?: 'active' | 'overdue' | 'suspended';
}

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

export interface ClassEnrollment {
  id: string;
  classId: string;
  studentId: string;
  enrolledAt: Date;
  attended: boolean;
}

export interface Vacation {
  id: string;
  teacherId: string;
  teacherName: string;
  startDate: Date;
  endDate: Date;
  approved: boolean;
  reason?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  status: 'paid' | 'pending' | 'overdue';
}

export interface Notification {
  id: string;
  userId?: string; // Optional for global notifications
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fitnesshub.com',
    role: 'admin',
    createdAt: new Date('2023-01-01'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: '2',
    name: 'John Trainer',
    email: 'john@fitnesshub.com',
    role: 'teacher',
    createdAt: new Date('2023-02-15'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    id: '3',
    name: 'Sarah Coach',
    email: 'sarah@fitnesshub.com',
    role: 'teacher',
    createdAt: new Date('2023-03-10'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    id: '4',
    name: 'Mike Student',
    email: 'mike@example.com',
    role: 'student',
    createdAt: new Date('2023-04-05'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  },
  {
    id: '5',
    name: 'Lisa Student',
    email: 'lisa@example.com',
    role: 'student',
    createdAt: new Date('2023-04-10'),
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: '2',
    name: 'John Trainer',
    email: 'john@fitnesshub.com',
    role: 'teacher',
    createdAt: new Date('2023-02-15'),
    specialties: ['Yoga', 'Pilates'],
    onVacation: false,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    id: '3',
    name: 'Sarah Coach',
    email: 'sarah@fitnesshub.com',
    role: 'teacher',
    createdAt: new Date('2023-03-10'),
    specialties: ['HIIT', 'CrossFit'],
    onVacation: true,
    vacationDates: {
      start: new Date('2023-08-01'),
      end: new Date('2023-08-15')
    },
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    id: '6',
    name: 'Carlos Fitness',
    email: 'carlos@fitnesshub.com',
    role: 'teacher',
    createdAt: new Date('2023-01-20'),
    specialties: ['Strength Training', 'Bodybuilding'],
    onVacation: false,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos'
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: '4',
    name: 'Mike Student',
    email: 'mike@example.com',
    role: 'student',
    createdAt: new Date('2023-04-05'),
    membershipType: 'Premium',
    lastCheckIn: new Date('2023-08-10T09:30:00'),
    enrolledClasses: ['1', '3'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  },
  {
    id: '5',
    name: 'Lisa Student',
    email: 'lisa@example.com',
    role: 'student',
    createdAt: new Date('2023-04-10'),
    membershipType: 'Standard',
    lastCheckIn: new Date('2023-08-09T16:45:00'),
    enrolledClasses: ['2'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa'
  },
  {
    id: '7',
    name: 'Alex Smith',
    email: 'alex@example.com',
    role: 'student',
    createdAt: new Date('2023-05-15'),
    membershipType: 'Basic',
    enrolledClasses: [],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
  },
  {
    id: '8',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    role: 'student',
    createdAt: new Date('2023-06-20'),
    membershipType: 'Premium',
    lastCheckIn: new Date('2023-08-10T10:15:00'),
    enrolledClasses: ['1', '4'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
  }
];

export const MOCK_CLASSES: FitnessClass[] = [
  {
    id: '1',
    name: 'Morning Yoga',
    description: 'Start your day with a refreshing yoga session',
    category: 'Yoga',
    teacherId: '2',
    teacherName: 'John Trainer',
    date: new Date('2023-08-15'),
    startTime: '07:00',
    endTime: '08:00',
    maxCapacity: 15,
    enrolledCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'HIIT Workout',
    description: 'High-intensity interval training for maximum calorie burn',
    category: 'HIIT',
    teacherId: '3',
    teacherName: 'Sarah Coach',
    date: new Date('2023-08-15'),
    startTime: '12:00',
    endTime: '13:00',
    maxCapacity: 12,
    enrolledCount: 10,
    imageUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Strength Training',
    description: 'Build muscle and strength with our comprehensive program',
    category: 'Strength',
    teacherId: '6',
    teacherName: 'Carlos Fitness',
    date: new Date('2023-08-15'),
    startTime: '18:00',
    endTime: '19:30',
    maxCapacity: 10,
    enrolledCount: 7,
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Evening Pilates',
    description: 'End your day with a relaxing and strengthening Pilates session',
    category: 'Pilates',
    teacherId: '2',
    teacherName: 'John Trainer',
    date: new Date('2023-08-16'),
    startTime: '19:00',
    endTime: '20:00',
    maxCapacity: 15,
    enrolledCount: 5,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    name: 'CrossFit Challenge',
    description: 'Push your limits with our CrossFit challenge',
    category: 'CrossFit',
    teacherId: '3',
    teacherName: 'Sarah Coach',
    date: new Date('2023-08-16'),
    startTime: '17:00',
    endTime: '18:30',
    maxCapacity: 8,
    enrolledCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
  }
];

export const MOCK_VACATIONS: Vacation[] = [
  {
    id: '1',
    teacherId: '3',
    teacherName: 'Sarah Coach',
    startDate: new Date('2023-08-01'),
    endDate: new Date('2023-08-15'),
    approved: true
  },
  {
    id: '2',
    teacherId: '2',
    teacherName: 'John Trainer',
    startDate: new Date('2023-09-10'),
    endDate: new Date('2023-09-20'),
    approved: true
  }
];
