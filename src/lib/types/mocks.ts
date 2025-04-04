
import { User, UserRole, Teacher, Student } from './users';
import { FitnessClass } from './classes';
import { Vacation } from './vacations';

// Mock Users Data
export const MOCK_USERS: User[] = [
  {
    id: 'usr-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'usr-2',
    email: 'teacher1@example.com',
    name: 'John Trainer',
    role: 'teacher',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'usr-3',
    email: 'student1@example.com',
    name: 'Maria Student',
    role: 'student',
    createdAt: new Date('2023-01-20')
  }
];

// Mock Teachers Data
export const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'tchr-1',
    userId: 'usr-2',
    name: 'John Trainer',
    email: 'teacher1@example.com',
    role: 'teacher',
    createdAt: new Date('2023-01-15'),
    specialties: ['Yoga', 'Pilates'],
    onVacation: false,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 'tchr-2',
    userId: 'usr-4',
    name: 'Sarah Smith',
    email: 'teacher2@example.com',
    role: 'teacher',
    createdAt: new Date('2023-02-10'),
    specialties: ['CrossFit', 'HIIT'],
    onVacation: true,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    vacationDates: {
      start: new Date('2023-06-01'),
      end: new Date('2023-06-15')
    }
  }
];

// Mock Students Data
export const MOCK_STUDENTS: Student[] = [
  {
    id: 'std-1',
    userId: 'usr-3',
    name: 'Maria Student',
    email: 'student1@example.com',
    role: 'student',
    createdAt: new Date('2023-01-20'),
    membershipType: 'Premium',
    membershipStatus: 'active',
    lastCheckIn: new Date('2023-05-15'),
    enrolledClasses: ['cls-1', 'cls-3'],
    taxNumber: '123456789',
    phoneNumber: '+351910000001',
    billingAddress: 'Rua Principal 123, Lisboa'
  },
  {
    id: 'std-2',
    userId: 'usr-5',
    name: 'Carlos Mendes',
    email: 'student2@example.com',
    role: 'student',
    createdAt: new Date('2023-02-05'),
    membershipType: 'Basic',
    membershipStatus: 'active',
    lastCheckIn: new Date('2023-05-14'),
    enrolledClasses: ['cls-2'],
    taxNumber: '987654321',
    phoneNumber: '+351910000002',
    billingAddress: 'Avenida Central 45, Porto'
  }
];

// Mock Classes Data
export const MOCK_CLASSES: FitnessClass[] = [
  {
    id: 'cls-1',
    name: 'Morning Yoga',
    description: 'Start your day with refreshing yoga poses and meditation.',
    category: 'Yoga',
    teacherId: 'tchr-1',
    teacherName: 'John Trainer',
    date: new Date('2023-05-20'),
    startTime: '08:00',
    endTime: '09:00',
    maxCapacity: 15,
    enrolledCount: 8,
    imageUrl: '/images/yoga.jpg'
  },
  {
    id: 'cls-2',
    name: 'CrossFit Challenge',
    description: 'High-intensity functional movements to push your limits.',
    category: 'CrossFit',
    teacherId: 'tchr-2',
    teacherName: 'Sarah Smith',
    date: new Date('2023-05-20'),
    startTime: '10:00',
    endTime: '11:00',
    maxCapacity: 10,
    enrolledCount: 6,
    imageUrl: '/images/crossfit.jpg'
  },
  {
    id: 'cls-3',
    name: 'Evening Pilates',
    description: 'Strengthen your core and improve flexibility with Pilates.',
    category: 'Pilates',
    teacherId: 'tchr-1',
    teacherName: 'John Trainer',
    date: new Date('2023-05-20'),
    startTime: '17:00',
    endTime: '18:00',
    maxCapacity: 12,
    enrolledCount: 5,
    imageUrl: '/images/pilates.jpg'
  }
];

// Mock Vacations Data
export const MOCK_VACATIONS: Vacation[] = [
  {
    id: 'vac-1',
    teacherId: 'tchr-2',
    teacherName: 'Sarah Smith',
    startDate: new Date('2023-06-01'),
    endDate: new Date('2023-06-15'),
    reason: 'Family vacation',
    approved: true,
    status: 'approved'
  }
];
