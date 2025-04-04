
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, CreditCard, DollarSign, Users } from "lucide-react";
import { getTeachersOnVacation } from "@/services/teacherService";
import { getUpcomingClassesToday } from "@/services/classService";
import { getTotalRevenue, getOverduePayments } from "@/services/membershipService";
import { getAllStudents } from "@/services/studentService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { FitnessClass } from "@/lib/types";

const Dashboard: React.FC = () => {
  const [teachersOnVacation, setTeachersOnVacation] = useState({ count: 0, teachers: [] });
  const [todayClasses, setTodayClasses] = useState<FitnessClass[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [overduePayments, setOverduePayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch teachers on vacation
        const vacationResult = await getTeachersOnVacation();
        if (vacationResult.success) {
          setTeachersOnVacation({
            count: vacationResult.count || 0,
            teachers: vacationResult.teachers || []
          });
        }

        // Fetch today's classes
        const classesResult = await getUpcomingClassesToday();
        if (classesResult.success) {
          setTodayClasses(classesResult.classes || []);
        }

        // Fetch total revenue
        const revenueResult = await getTotalRevenue();
        if (revenueResult.success) {
          setTotalRevenue(revenueResult.totalRevenue || 0);
        }

        // Fetch total students
        const studentsResult = await getAllStudents();
        if (studentsResult.success) {
          setTotalStudents(studentsResult.students?.length || 0);
        }

        // Fetch overdue payments
        const paymentsResult = await getOverduePayments();
        if (paymentsResult.success && paymentsResult.overduePayments) {
          setOverduePayments(paymentsResult.overduePayments);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Dashboard" role="admin">
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Alunos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Alunos matriculados atualmente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR' }).format(totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total arrecadado até hoje
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Aulas Hoje
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayClasses.length}</div>
                <p className="text-xs text-muted-foreground">
                  Aulas programadas para hoje
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Professores de Férias
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachersOnVacation.count}</div>
                <p className="text-xs text-muted-foreground">
                  Professores atualmente de férias
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Aulas de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                {todayClasses.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-8">
                    Não há aulas programadas para hoje.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aula</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Professor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayClasses.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell className="font-medium">{cls.name}</TableCell>
                          <TableCell>{`${cls.startTime} - ${cls.endTime}`}</TableCell>
                          <TableCell>{cls.teacherName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Pagamentos em Atraso</CardTitle>
              </CardHeader>
              <CardContent>
                {overduePayments.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-8">
                    Não há pagamentos em atraso.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {overduePayments.slice(0, 5).map((payment: any) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.student_profiles?.name || "Aluno"}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR' }).format(payment.amount)}
                          </TableCell>
                          <TableCell>{format(new Date(payment.due_date), 'dd/MM/yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {overduePayments.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      Ver todos os pagamentos em atraso
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Professores de Férias</CardTitle>
              </CardHeader>
              <CardContent>
                {teachersOnVacation.teachers.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-8">
                    Não há professores de férias no momento.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Especialidades</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachersOnVacation.teachers.map((teacher: any) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell>{Array.isArray(teacher.specialties) ? teacher.specialties.join(", ") : teacher.specialties}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
