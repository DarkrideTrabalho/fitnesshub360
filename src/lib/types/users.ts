
// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: Date;
}

export interface Admin extends UserProfile {
  // Admin-specific properties
}

export interface Teacher extends UserProfile {
  specialties?: string[];
  onVacation: boolean;
}

export interface Student extends UserProfile {
  membershipType: string;
  membershipStatus: string; // 'active', 'expired', 'suspended', etc.
  lastCheckIn?: Date;
  taxNumber?: string;
  phoneNumber?: string;
  billingAddress?: string;
}
