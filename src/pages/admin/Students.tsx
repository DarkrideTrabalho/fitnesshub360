
import React, { useState, useEffect } from "react";
import { Plus, Users, Search, X, Send, Phone, CreditCard, AlertCircle } from "lucide-react";
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
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import UserCard from "@/components/UserCard";
import { Student, MOCK_STUDENTS } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"name" | "taxNumber">("name");
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*');
        
        if (error) {
          console.error("Error fetching students:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const transformedStudents = data.map(student => ({
            id: student.id,
            name: student.name || '',
            email: student.email || '',
            role: 'student' as const,
            createdAt: new Date(student.created_at),
            membershipType: student.membership_type || 'Basic',
            lastCheckIn: student.last_check_in ? new Date(student.last_check_in) : undefined,
            enrolledClasses: [],
            avatarUrl: student.avatar_url,
            taxNumber: student.tax_number,
            phoneNumber: student.phone_number,
            userId: student.user_id,
            // Check if membership_status exists, use a default value if not
            membershipStatus: 'membership_status' in student ? student.membership_status : 'active'
          }));
          setStudents(transformedStudents);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
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
          </div>
        </div>
        
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
        
        {filteredStudents.length === 0 ? (
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
      </div>
      
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
    </DashboardLayout>
  );
};

export default StudentsPage;
