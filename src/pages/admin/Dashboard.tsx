
import React, { useState } from "react";
import { Users, Calendar, Clock, Activity } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import CalendarView from "@/components/CalendarView";
import UserCard from "@/components/UserCard";
import { MOCK_CLASSES, MOCK_STUDENTS, MOCK_TEACHERS } from "@/lib/types";

const AdminDashboard = () => {
  const teachersOnVacation = MOCK_TEACHERS.filter(teacher => teacher.onVacation);
  
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
            title="Avg. Attendance"
            value="76%"
            icon={<Activity className="h-5 w-5 text-primary" />}
            trend={{ value: 3, label: "vs last month", positive: false }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <CalendarView classes={MOCK_CLASSES} />
          </div>
          
          <div>
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
                            {teacher.avatarUrl ? (
                              <img
                                src={teacher.avatarUrl}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
