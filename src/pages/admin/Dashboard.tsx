import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import ClassOverviewCard from "@/components/ClassOverviewCard";
import VacationApprovalCard from "@/components/VacationApprovalCard";
import { getVacationRequests, approveVacationRequest, rejectVacationRequest } from "@/services/vacationService";
import { getTeachersOnVacation } from "@/services/teacherService";
import { format } from "date-fns";
import { toast } from "sonner";
import { getUpcomingClassesToday } from "@/services/classService";
import { getOverduePayments, getTotalRevenue } from "@/services/membershipService";
import { getAllStudents } from "@/services/studentService";
import { FitnessClass } from "@/lib/types/classes";

const Dashboard: React.FC = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [upcomingClasses, setUpcomingClasses] = useState<FitnessClass[]>([]);
    const [teachersOnVacation, setTeachersOnVacation] = useState([]);
    const [vacationRequests, setVacationRequests] = useState([]);
    const [overduePayments, setOverduePayments] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch total students
                const studentsResult = await getAllStudents();
                if (studentsResult.success) {
                    setTotalStudents(studentsResult.students.length);
                } else {
                    console.error("Error fetching students:", studentsResult.error);
                    toast.error("Failed to fetch students");
                }

                // Fetch upcoming classes for today
                const classesResult = await getUpcomingClassesToday();
                if (classesResult.success) {
                    setUpcomingClasses(classesResult.classes);
                } else {
                    console.error("Error fetching upcoming classes:", classesResult.error);
                    toast.error("Failed to fetch upcoming classes");
                }

                // Fetch teachers on vacation
                const vacationingTeachersResult = await getTeachersOnVacation();
                if (vacationingTeachersResult.success) {
                    setTeachersOnVacation(vacationingTeachersResult.teachers);
                } else {
                    console.error("Error fetching teachers on vacation:", vacationingTeachersResult.error);
                    toast.error("Failed to fetch teachers on vacation");
                }

                // Fetch vacation requests
                const vacationRequestsResult = await getVacationRequests();
                if (vacationRequestsResult.success) {
                    setVacationRequests(vacationRequestsResult.vacations);
                } else {
                    console.error("Error fetching vacation requests:", vacationRequestsResult.error);
                    toast.error("Failed to fetch vacation requests");
                }

                // Fetch overdue payments
                const overduePaymentsResult = await getOverduePayments();
                if (overduePaymentsResult.success) {
                    setOverduePayments(overduePaymentsResult.overduePayments);
                } else {
                    console.error("Error fetching overdue payments:", overduePaymentsResult.error);
                    toast.error("Failed to fetch overdue payments");
                }

                 // Fetch total revenue
                 const totalRevenueResult = await getTotalRevenue();
                 if (totalRevenueResult.success) {
                     setTotalRevenue(totalRevenueResult.totalRevenue);
                 } else {
                     console.error("Error fetching total revenue:", totalRevenueResult.error);
                     toast.error("Failed to fetch total revenue");
                 }

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApproveVacation = async (vacationId: string) => {
        try {
            const result = await approveVacationRequest(vacationId);
            if (result.success) {
                setVacationRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === vacationId ? { ...request, status: 'approved' } : request
                    )
                );
                toast.success("Vacation request approved successfully");
                // Refresh teachers on vacation
                const vacationingTeachersResult = await getTeachersOnVacation();
                if (vacationingTeachersResult.success) {
                    setTeachersOnVacation(vacationingTeachersResult.teachers);
                } else {
                    console.error("Error fetching teachers on vacation:", vacationingTeachersResult.error);
                    toast.error("Failed to refresh teachers on vacation");
                }
            } else {
                toast.error("Failed to approve vacation request");
            }
        } catch (error) {
            console.error("Error approving vacation request:", error);
            toast.error("An error occurred while approving vacation request");
        }
    };

    const handleRejectVacation = async (vacationId: string) => {
        try {
            const result = await rejectVacationRequest(vacationId);
            if (result.success) {
                setVacationRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === vacationId ? { ...request, status: 'rejected' } : request
                    )
                );
                toast.success("Vacation request rejected successfully");
            } else {
                toast.error("Failed to reject vacation request");
            }
        } catch (error) {
            console.error("Error rejecting vacation request:", error);
            toast.error("An error occurred while rejecting vacation request");
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Dashboard" role="admin">
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Dashboard" role="admin">
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="management">Management</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Students"
                            value={totalStudents}
                            icon={<Users />}
                            color="primary"
                        />
                        <StatCard
                            title="Upcoming Classes Today"
                            value={upcomingClasses.length}
                            icon={<Calendar />}
                            color="secondary"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={totalRevenue}
                            icon={<DollarSign />}
                            color="success"
                        />
                        <StatCard
                            title="Teachers on Vacation"
                            value={teachersOnVacation.length}
                            icon={<ExternalLink />}
                            color="warning"
                        />
                        <StatCard
                            title="Overdue Payments"
                            value={overduePayments}
                            icon={<TrendingUp />}
                            color="destructive"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Upcoming Classes Today</h2>
                        {upcomingClasses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {upcomingClasses.map((classItem) => (
                                    <ClassOverviewCard key={classItem.id} classItem={classItem} />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-8">
                                    <p className="text-center text-gray-500">No upcoming classes today.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="management" className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Vacation Requests</h2>
                        {vacationRequests.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vacationRequests.map((vacation) => (
                                    <VacationApprovalCard
                                        key={vacation.id}
                                        vacation={vacation}
                                        onApprove={handleApproveVacation}
                                        onReject={handleRejectVacation}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="py-8">
                                    <p className="text-center text-gray-500">No pending vacation requests.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="reports">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Reports and Analytics</h2>
                        <p>Detailed reports and analytics are coming soon.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
};

export default Dashboard;
