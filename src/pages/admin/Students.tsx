
import React, { useState, useEffect } from "react";
import { Plus, Users, Search, X, Send, Phone, CreditCard, AlertCircle, Calendar, UserPlus, Eye, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import UserCard from "@/components/UserCard";
import { Student } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import EnrolledStudentsTable from "@/components/EnrolledStudentsTable";
import StudentRegistrationForm from "@/components/StudentRegistrationForm";

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "taxNumber">("name");
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false);
  
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*');
        
        if (error) {
          console.error("Error fetching students:", error);
          return;
        }
        
        if (data) {
          const mappedStudents = data.map(student => ({
            id: student.id,
            name: student.name || 'Unknown',
            email: student.email || '',
            role: 'student' as const,
            createdAt: new Date(student.created_at),
            membershipType: student.membership_type || 'Standard',
            lastCheckIn: student.last_check_in ? new Date(student.last_check_in) : undefined,
            enrolledClasses: [],
            avatar: student.avatar_url || '',
            taxNumber: student.tax_number || '',
            phoneNumber: student.phone_number || '',
            userId: student.user_id,
            membershipStatus: 'active' as string
          }));
          
          setStudents(mappedStudents);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledStudents = async () => {
      setEnrolledLoading(true);
      try {
        // This query would be more complex in a real app, joining enrollments with classes and students
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            student_id,
            class_id,
            student_profiles!inner(
              id, name, email, phone_number, tax_number, avatar_url
            ),
            classes!inner(
              id, name, date, start_time
            )
          `);
        
        if (error) {
          console.error("Error fetching enrolled students:", error);
          return;
        }
        
        if (data) {
          // Group by student
          const studentMap = new Map();
          
          data.forEach(enrollment => {
            const studentId = enrollment.student_profiles.id;
            
            if (!studentMap.has(studentId)) {
              studentMap.set(studentId, {
                id: studentId,
                name: enrollment.student_profiles.name,
                email: enrollment.student_profiles.email,
                phoneNumber: enrollment.student_profiles.phone_number,
                taxNumber: enrollment.student_profiles.tax_number,
                avatarUrl: enrollment.student_profiles.avatar_url,
                enrolledClasses: []
              });
            }
            
            const student = studentMap.get(studentId);
            student.enrolledClasses.push({
              id: enrollment.classes.id,
              name: enrollment.classes.name,
              date: new Date(enrollment.classes.date),
              startTime: enrollment.classes.start_time
            });
          });
          
          setEnrolledStudents(Array.from(studentMap.values()));
        }
      } catch (error) {
        console.error("Failed to fetch enrolled students:", error);
      } finally {
        setEnrolledLoading(false);
      }
    };

    fetchStudents();
    fetchEnrolledStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    if (searchBy === "name") {
      return student.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchBy === "taxNumber" && student.taxNumber) {
      return student.taxNumber.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  const handleSendSMS = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }
    
    setLoading(true);
    
    try {
      const registrationId = Math.random().toString(36).substring(2, 15);
      const registrationLink = `https://fitnesshub.com/register/${registrationId}`;
      
      // In a real app, this would call an SMS API via Supabase Edge Function
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`SMS with registration link sent to ${phoneNumber}`);
      setPhoneNumber("");
      setIsSMSDialogOpen(false);
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_payments')
        .select('*')
        .eq('student_id', studentId)
        .eq('status', 'overdue')
        .limit(1);
        
      if (error) {
        console.error("Error checking payment status:", error);
        return;
      }
      
      if (data && data.length > 0) {
        toast.error(`This student has overdue payments.`, {
          description: "The payment was due on " + new Date(data[0].due_date).toLocaleDateString(),
          action: {
            label: "View",
            onClick: () => {
              console.log("View payment details for student:", studentId);
            }
          }
        });
      } else {
        toast.success("No overdue payments found");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  const handleRegistrationSubmit = (data: any) => {
    console.log("Registration data:", data);
    toast.success("Registration form submitted successfully!");
    setIsRegistrationFormOpen(false);
    // In a real app, we would save this data to the database
  };
  
  const handleViewStudentDetails = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsStudentDetailsOpen(true);
  };
  
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
            <p className="text-slate-600">Manage your students</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsSMSDialogOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              SMS Registration
            </Button>
            <Button 
              onClick={() => setIsRegistrationFormOpen(true)}
              variant="default"
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              New Registration
            </Button>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="enrolled">Class Enrollments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={`Search by ${searchBy === "name" ? "name" : "tax number"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={searchBy === "name" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchBy("name")}
                >
                  Name
                </Button>
                <Button
                  variant={searchBy === "taxNumber" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchBy("taxNumber")}
                >
                  Tax Number
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Users className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-900">No students found</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "No students available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="relative">
                    <UserCard
                      user={student}
                      buttons={[
                        {
                          icon: <CreditCard className="h-4 w-4" />,
                          label: "Check Payment",
                          onClick: () => checkPaymentStatus(student.id)
                        },
                        {
                          icon: <Eye className="h-4 w-4" />,
                          label: "View Details",
                          onClick: () => handleViewStudentDetails(student.id)
                        }
                      ]}
                    />
                    {student.membershipStatus === 'overdue' && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center rounded-full bg-red-100 p-1 text-xs font-medium text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="enrolled" className="space-y-4">
            <EnrolledStudentsTable 
              students={enrolledStudents}
              loading={enrolledLoading}
              onViewDetails={handleViewStudentDetails}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* SMS Dialog */}
      <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Registration Link via SMS</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number*
              </label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+351 910000000"
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                Enter the phone number with country code
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h4 className="text-sm font-medium text-slate-800">What happens next?</h4>
              <p className="mt-1 text-xs text-slate-600">
                An SMS will be sent to this number with a unique registration link. The student can fill out their details, including billing information, through this link.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSendSMS} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? "Sending..." : (
                <>
                  <Send className="h-4 w-4" />
                  Send SMS
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Student Registration Form Dialog */}
      <Dialog open={isRegistrationFormOpen} onOpenChange={setIsRegistrationFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Registration Form</DialogTitle>
          </DialogHeader>
          
          <StudentRegistrationForm 
            onSubmit={handleRegistrationSubmit}
            isLoading={loading}
          />
        </DialogContent>
      </Dialog>
      
      {/* Student Details Dialog */}
      <Dialog open={isStudentDetailsOpen} onOpenChange={setIsStudentDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-slate-50">
              <p className="text-sm text-slate-500">
                This dialog would show detailed information about the selected student, including their profile, 
                enrollment history, attendance records, payment history, and more.
              </p>
              <p className="mt-2 text-sm text-primary">
                In a real application, this would fetch the student details from the database and display them here.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStudentDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentsPage;
