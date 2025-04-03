
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
  AlertTriangle,
  BarChart,
  DollarSign 
} from 'lucide-react';
import { getTeachersOnVacation } from '@/services/teacherService';
import { getClassesForToday, getClassesCount } from '@/services/classService';
import { getStudentsCount, getOverduePaymentsCount } from '@/services/studentService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FitnessClass } from '@/lib/types';
import ClassOverviewCard from '@/components/ClassOverviewCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const [pendingVacations, setPendingVacations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    studentsCount: 0,
    teachersCount: 0,
    teachersOnVacation: 0,
    todayClassesCount: 0,
    overduePayments: 0,
    totalClasses: 0,
    thisMonthRevenue: 0,
    attendanceRate: 0
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
        teachersCountResult,
        teachersOnVacationResult, 
        todayClassesResult,
        overduePaymentsResult,
        totalClassesResult
      ] = await Promise.all([
        getStudentsCount(),
        { success: true, count: 12 }, // Mock teacher count - replace with actual API call
        getTeachersOnVacation(),
        getClassesForToday(),
        getOverduePaymentsCount(),
        getClassesCount()
      ]);

      setDashboardStats({
        studentsCount: studentsCountResult.success ? studentsCountResult.count : 0,
        teachersCount: teachersCountResult.success ? teachersCountResult.count : 0,
        teachersOnVacation: teachersOnVacationResult.success ? teachersOnVacationResult.count : 0,
        todayClassesCount: todayClassesResult.success ? todayClassesResult.classes.length : 0,
        overduePayments: overduePaymentsResult.success ? overduePaymentsResult.count : 0,
        totalClasses: totalClassesResult.success ? totalClassesResult.count : 0,
        thisMonthRevenue: 5280, // Mock revenue data - replace with actual API call
        attendanceRate: 78 // Mock attendance rate - replace with actual API call
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Students" 
          value={dashboardStats.studentsCount} 
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          trend={{ value: 5, label: "from last month", positive: true }}
        />
        <StatCard 
          title="Total Teachers" 
          value={dashboardStats.teachersCount} 
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatCard 
          title="Teachers on Vacation" 
          value={dashboardStats.teachersOnVacation} 
          icon={<UserCheck className="h-5 w-5 text-amber-600" />}
        />
        <StatCard 
          title="Total Overdue Payments" 
          value={dashboardStats.overduePayments} 
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Today's Classes" 
          value={dashboardStats.todayClassesCount} 
          icon={<Calendar className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard 
          title="Total Classes" 
          value={dashboardStats.totalClasses} 
          icon={<CalendarClock className="h-5 w-5 text-blue-600" />}
        />
        <StatCard 
          title="This Month Revenue" 
          value={`$${dashboardStats.thisMonthRevenue}`} 
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          trend={{ value: 8, label: "from last month", positive: true }}
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${dashboardStats.attendanceRate}%`} 
          icon={<BarChart className="h-5 w-5 text-purple-600" />}
          trend={{ value: 3, label: "from last month", positive: true }}
        />
      </div>
      
      {/* Today's Classes */}
      <div className="mb-8">
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

      {/* Students with Overdue Payments */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Overdue Payments</h2>
        <Card>
          <CardHeader>
            <CardTitle>Students with Pending Payments</CardTitle>
            <CardDescription>
              Students who have overdue payments that require attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading payments...</TableCell>
                  </TableRow>
                ) : dashboardStats.overduePayments > 0 ? (
                  [
                    // Mock data - replace with actual data from API
                    { id: 1, name: 'John Doe', amount: '$120', dueDate: '2025-03-15', daysOverdue: 19, status: 'overdue' },
                    { id: 2, name: 'Jane Smith', amount: '$85', dueDate: '2025-03-20', daysOverdue: 14, status: 'overdue' },
                    { id: 3, name: 'Michael Johnson', amount: '$150', dueDate: '2025-03-25', daysOverdue: 9, status: 'overdue' }
                  ].map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.name}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{payment.daysOverdue} days</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                          {payment.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No overdue payments found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
                  reason: vacation.reason || 'No reason provided',
                  status: vacation.status
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
