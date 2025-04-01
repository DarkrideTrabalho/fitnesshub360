
import React, { useState, useEffect } from "react";
import { Users, Calendar, Clock, Activity, AlertCircle, CreditCard } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import CalendarView from "@/components/CalendarView";
import { MOCK_CLASSES, MOCK_STUDENTS, MOCK_TEACHERS } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Teacher } from "@/lib/types";

const AdminDashboard = () => {
  const [teachersOnVacation, setTeachersOnVacation] = useState<Teacher[]>(MOCK_TEACHERS.filter(teacher => teacher.onVacation));
  const [overduePaymentsCount, setOverduePaymentsCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch teachers on vacation
    const fetchTeachersOnVacation = async () => {
      try {
        const { data, error } = await supabase
          .from('teacher_profiles')
          .select('*, vacations(*)')
          .eq('on_vacation', true);
          
        if (error) {
          console.error("Error fetching teachers on vacation:", error);
          return;
        }
        
        if (data) {
          const transformedTeachers: Teacher[] = data.map(teacher => ({
            id: teacher.id,
            userId: teacher.user_id,
            name: teacher.name || '',
            email: teacher.email || '',
            role: 'teacher',
            createdAt: new Date(teacher.created_at),
            specialties: teacher.specialties || [],
            onVacation: true,
            vacationDates: teacher.vacations && teacher.vacations.length > 0 ? {
              start: new Date(teacher.vacations[0].start_date),
              end: new Date(teacher.vacations[0].end_date)
            } : undefined,
            avatar: teacher.avatar_url
          }));
          setTeachersOnVacation(transformedTeachers);
        }
      } catch (error) {
        console.error("Failed to fetch teachers on vacation:", error);
      }
    };
    
    // Fetch overdue payments count
    const fetchOverduePayments = async () => {
      try {
        // Use raw queries to avoid TypeScript errors with database schema
        const { count, error } = await supabase
          .from('student_payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'overdue');
          
        if (error) {
          console.error("Error fetching overdue payments:", error);
          return;
        }
        
        setOverduePaymentsCount(count || 0);
      } catch (error) {
        console.error("Failed to fetch overdue payments:", error);
      }
    };
    
    // Fetch recent notifications
    const fetchNotifications = async () => {
      try {
        // Use raw queries to avoid TypeScript errors with database schema
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) {
          console.error("Error fetching notifications:", error);
          return;
        }
        
        if (data) {
          setRecentNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    
    fetchTeachersOnVacation();
    fetchOverduePayments();
    fetchNotifications();
  }, []);
  
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Welcome to the admin control panel</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={MOCK_STUDENTS.length}
            icon={<Users className="h-5 w-5 text-primary" />}
            trend={{ value: 12, label: "vs last month", positive: true }}
          />
          <StatCard
            title="Total Classes"
            value={MOCK_CLASSES.length}
            icon={<Calendar className="h-5 w-5 text-primary" />}
            trend={{ value: 8, label: "vs last month", positive: true }}
          />
          <StatCard
            title="Class Hours"
            value="48h"
            icon={<Clock className="h-5 w-5 text-primary" />}
            trend={{ value: 5, label: "vs last month", positive: true }}
          />
          <StatCard
            title="Overdue Payments"
            value={overduePaymentsCount}
            icon={<AlertCircle className="h-5 w-5 text-red-500" />}
            trend={{ value: overduePaymentsCount > 0 ? 100 : 0, label: "action needed", positive: false }}
            className={overduePaymentsCount > 0 ? "border-red-100 bg-red-50" : ""}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <CalendarView classes={MOCK_CLASSES} />
          </div>
          
          <div className="space-y-6">
            {/* Teachers on Vacation */}
            <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-medium text-slate-900 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Teachers on Vacation
                </h3>
              </div>
              
              <div className="p-4">
                {teachersOnVacation.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">
                    No teachers currently on vacation
                  </p>
                ) : (
                  <div className="space-y-3">
                    {teachersOnVacation.map(teacher => (
                      <div key={teacher.id} className="p-3 border border-slate-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {teacher.avatar ? (
                              <img
                                src={teacher.avatar}
                                alt={teacher.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Users className="h-5 w-5 text-primary" />
                            )}
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{teacher.name}</h4>
                            <p className="text-xs text-amber-600">
                              {teacher.vacationDates 
                                ? `Until ${new Date(teacher.vacationDates.end).toLocaleDateString()}`
                                : "On vacation"
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Overdue Payments */}
            {overduePaymentsCount > 0 && (
              <div className="bg-white border border-red-100 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100">
                  <h3 className="font-medium text-red-800 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Overdue Payments
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {overduePaymentsCount} {overduePaymentsCount === 1 ? 'student' : 'students'} with overdue payments
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Requires immediate attention
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/admin/students'}
                      className="text-xs"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recent Notifications */}
            {recentNotifications.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-medium text-slate-900 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Recent Notifications
                  </h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {recentNotifications.map(notification => (
                    <div key={notification.id} className="p-4">
                      <h4 className="text-sm font-medium text-slate-900">{notification.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
