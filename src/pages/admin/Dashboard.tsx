
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getPendingVacationRequests, handleVacationRequest } from '@/services/vacationService';
import VacationApprovalCard from '@/components/VacationApprovalCard';
import { toast } from 'sonner';
import StatCard from '@/components/StatCard';
import { 
  Users, 
  UserCheck, 
  CalendarClock, 
  CreditCard, 
  Calendar, 
  AlertTriangle 
} from 'lucide-react';
import { getTeachersOnVacation } from '@/services/teacherService';
import { getClassesForToday, getClassesCount } from '@/services/classService';
import { getStudentsCount, getOverduePaymentsCount } from '@/services/studentService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FitnessClass } from '@/lib/types';
import ClassOverviewCard from '@/components/ClassOverviewCard';

const AdminDashboard = () => {
  const [pendingVacations, setPendingVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    studentsCount: 0,
    teachersOnVacation: 0,
    todayClassesCount: 0,
    overduePayments: 0,
    totalClasses: 0
  });
  const [todayClasses, setTodayClasses] = useState([]);

  useEffect(() => {
    fetchPendingVacations();
    fetchDashboardStats();
  }, []);

  const fetchPendingVacations = async () => {
    try {
      const result = await getPendingVacationRequests();
      if (result.success) {
        setPendingVacations(result.vacations || []);
      } else {
        console.error('Failed to fetch pending vacations');
        toast.error('Failed to load vacation requests');
      }
    } catch (error) {
      console.error('Error fetching vacations:', error);
      toast.error('Error loading vacation requests');
    }
  };

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch all stats in parallel
      const [
        studentsCountResult, 
        teachersOnVacationResult, 
        todayClassesResult,
        overduePaymentsResult,
        totalClassesResult
      ] = await Promise.all([
        getStudentsCount(),
        getTeachersOnVacation(),
        getClassesForToday(),
        getOverduePaymentsCount(),
        getClassesCount()
      ]);

      setDashboardStats({
        studentsCount: studentsCountResult.success ? studentsCountResult.count : 0,
        teachersOnVacation: teachersOnVacationResult.success ? teachersOnVacationResult.count : 0,
        todayClassesCount: todayClassesResult.success ? todayClassesResult.classes.length : 0,
        overduePayments: overduePaymentsResult.success ? overduePaymentsResult.count : 0,
        totalClasses: totalClassesResult.success ? totalClassesResult.count : 0
      });

      if (todayClassesResult.success) {
        setTodayClasses(todayClassesResult.classes);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Error loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleVacationApproval = async (vacationId, approved) => {
    try {
      const result = await handleVacationRequest(vacationId, approved);
      if (result.success) {
        // Refresh the list of pending vacations
        fetchPendingVacations();
        // Also refresh dashboard stats as teachers on vacation count may have changed
        fetchDashboardStats();
        toast.success(`Vacation request ${approved ? 'approved' : 'rejected'} successfully`);
      }
    } catch (error) {
      console.error('Error handling vacation approval:', error);
      toast.error('Error processing vacation request');
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard" role="admin">
      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <StatCard 
          title="Total Students" 
          value={dashboardStats.studentsCount} 
          icon={<Users className="h-5 w-5 text-indigo-600" />}
        />
        <StatCard 
          title="Teachers on Vacation" 
          value={dashboardStats.teachersOnVacation} 
          icon={<UserCheck className="h-5 w-5 text-amber-600" />}
        />
        <StatCard 
          title="Today's Classes" 
          value={dashboardStats.todayClassesCount} 
          icon={<Calendar className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard 
          title="Overdue Payments" 
          value={dashboardStats.overduePayments} 
          icon={<CreditCard className="h-5 w-5 text-red-600" />}
        />
        <StatCard 
          title="Total Classes" 
          value={dashboardStats.totalClasses} 
          icon={<CalendarClock className="h-5 w-5 text-blue-600" />}
        />
      </div>
      
      {/* Today's Classes */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Today's Classes</h2>
        {loading ? (
          <p>Loading classes...</p>
        ) : todayClasses.length === 0 ? (
          <p>No classes scheduled for today.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayClasses.map((classItem) => (
              <ClassOverviewCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        )}
      </div>

      {/* Pending Vacation Approvals */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Pending Vacation Approvals</h2>
        {loading ? (
          <p>Loading vacations...</p>
        ) : pendingVacations.length === 0 ? (
          <p>No pending vacation requests.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingVacations.map((vacation) => (
              <VacationApprovalCard
                key={vacation.id}
                vacation={{
                  id: vacation.id,
                  teacherName: vacation.teacher_name || 'Unknown Teacher',
                  startDate: vacation.start_date,
                  endDate: vacation.end_date,
                  reason: vacation.reason || 'No reason provided'
                }}
                onApprove={(id) => handleVacationApproval(id, true)}
                onReject={(id) => handleVacationApproval(id, false)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
