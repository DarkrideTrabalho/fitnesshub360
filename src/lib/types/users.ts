
// User Types
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  createdAt?: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Admin extends UserProfile {
  // Admin-specific properties
}

export interface Teacher extends UserProfile {
  specialties?: string[];
  onVacation: boolean;
  vacationDates?: {
    start: Date;
    end: Date;
  };
}

export interface Student extends UserProfile {
  membershipType: string;
  membershipStatus: string; // 'active', 'expired', 'suspended', etc.
  lastCheckIn?: Date;
  taxNumber?: string;
  phoneNumber?: string;
  billingAddress?: string;
  enrolledClasses?: string[];
}
