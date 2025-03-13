import React, { useState, useEffect } from "react";
import { Plus, Users, Search, X, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import UserCard from "@/components/UserCard";
import VacationApprovalCard from "@/components/VacationApprovalCard";
import { Teacher, MOCK_TEACHERS, MOCK_CLASSES, FitnessClass, Vacation } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { createNotification } from "@/services/notificationService";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [classes, setClasses] = useState<FitnessClass[]>(MOCK_CLASSES);
  const [pendingVacations, setPendingVacations] = useState<Vacation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVacationOnly, setShowVacationOnly] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAssignClassesOpen, setIsAssignClassesOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    emailDomain: "@fitnesshub.com",
    specialties: "",
  });
  const [affectedClasses, setAffectedClasses] = useState<FitnessClass[]>([]);
  const [showAffectedClassesDialog, setShowAffectedClassesDialog] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from('teacher_profiles')
          .select('*');
        
        if (error) {
          console.error("Error fetching teachers:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const transformedTeachers = data.map(teacher => ({
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            role: 'teacher' as const,
            createdAt: new Date(teacher.created_at),
            specialties: teacher.specialties || [],
            onVacation: teacher.on_vacation || false,
            avatarUrl: teacher.avatar_url,
          }));
          setTeachers(transformedTeachers);
        }
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      }
    };

    const fetchClasses = async () => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*');
        
        if (error) {
          console.error("Error fetching classes:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const transformedClasses = data.map(cls => ({
            id: cls.id,
            name: cls.name,
            description: cls.description || '',
            category: cls.category || '',
            teacherId: cls.teacher_id,
            teacherName: '', // Will be filled in later
            date: new Date(cls.date),
            startTime: cls.start_time,
            endTime: cls.end_time,
            maxCapacity: cls.max_capacity,
            enrolledCount: cls.enrolled_count,
            imageUrl: cls.image_url,
          }));
          setClasses(transformedClasses);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    const fetchPendingVacations = async () => {
      try {
        const { data, error } = await supabase
          .from('vacations')
          .select('*')
          .eq('approved', false);
        
        if (error) {
          console.error("Error fetching pending vacations:", error);
          return;
        }
        
        if (data && data.length > 0) {
          const transformedVacations = data.map(vacation => ({
            id: vacation.id,
            teacherId: vacation.teacher_id,
            teacherName: vacation.teacher_name,
            startDate: new Date(vacation.start_date),
            endDate: new Date(vacation.end_date),
            approved: vacation.approved,
            reason: vacation.reason,
            createdAt: new Date(vacation.created_at),
          }));
          setPendingVacations(transformedVacations);
        }
      } catch (error) {
        console.error("Failed to fetch pending vacations:", error);
      }
    };

    fetchTeachers();
    fetchClasses();
    fetchPendingVacations();
  }, []);
  
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVacation = showVacationOnly ? teacher.onVacation : true;
    
    return matchesSearch && matchesVacation;
  });
  
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, '').toLowerCase();
    setNewTeacher({...newTeacher, email: value});
  };
  
  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const fullEmail = newTeacher.email + newTeacher.emailDomain;
    const specialtiesArray = newTeacher.specialties
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
      
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: fullEmail,
        password: 'temporary123',
        email_confirm: true
      });
      
      if (userError) {
        console.error("Error creating user:", userError);
        toast.error("Error creating user: " + userError.message);
        return;
      }
      
      const { data: teacherData, error: teacherError } = await supabase
        .from('teacher_profiles')
        .insert({
          user_id: userData.user.id,
          name: newTeacher.name,
          email: fullEmail,
          specialties: specialtiesArray,
          on_vacation: false,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTeacher.name}`
        })
        .select();
        
      if (teacherError) {
        console.error("Error creating teacher profile:", teacherError);
        toast.error("Error creating teacher profile: " + teacherError.message);
        return;
      }
      
      const teacher: Teacher = {
        id: teacherData[0].id,
        name: newTeacher.name,
        email: fullEmail,
        role: "teacher",
        createdAt: new Date(),
        specialties: specialtiesArray,
        onVacation: false,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTeacher.name}`,
      };
      
      setTeachers([...teachers, teacher]);
      
      setNewTeacher({ 
        name: "", 
        email: "", 
        emailDomain: "@fitnesshub.com", 
        specialties: "" 
      });
      setIsAddTeacherOpen(false);
      
      toast.success("Teacher added successfully");
    } catch (error) {
      console.error("Error in teacher creation:", error);
      toast.error("Failed to create teacher");
    }
  };
  
  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      const teacher = teachers.find(t => t.id === teacherId);
      if (!teacher) return;
      
      const { error } = await supabase
        .from('teacher_profiles')
        .delete()
        .eq('id', teacherId);
        
      if (error) {
        console.error("Error deleting teacher:", error);
        toast.error("Error deleting teacher: " + error.message);
        return;
      }
      
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error("Error in teacher deletion:", error);
      toast.error("Failed to delete teacher");
    }
  };
  
  const openAssignClasses = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    
    const fetchTeacherClasses = async () => {
      try {
        const { data, error } = await supabase
          .from('teacher_classes')
          .select('class_id')
          .eq('teacher_id', teacher.id);
          
        if (error) {
          console.error("Error fetching teacher classes:", error);
          return;
        }
        
        if (data) {
          setSelectedClasses(data.map(tc => tc.class_id));
        }
      } catch (error) {
        console.error("Failed to fetch teacher classes:", error);
      }
    };
    
    fetchTeacherClasses();
    setIsAssignClassesOpen(true);
  };
  
  const handleAssignClasses = async () => {
    if (!selectedTeacher) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('teacher_classes')
        .delete()
        .eq('teacher_id', selectedTeacher.id);
        
      if (deleteError) {
        console.error("Error deleting existing class assignments:", deleteError);
        toast.error("Error updating class assignments");
        return;
      }
      
      if (selectedClasses.length > 0) {
        const assignmentsToInsert = selectedClasses.map(classId => ({
          teacher_id: selectedTeacher.id,
          class_id: classId
        }));
        
        const { error: insertError } = await supabase
          .from('teacher_classes')
          .insert(assignmentsToInsert);
          
        if (insertError) {
          console.error("Error assigning classes:", insertError);
          toast.error("Error assigning classes");
          return;
        }
      }
      
      setIsAssignClassesOpen(false);
      toast.success("Classes assigned successfully");
    } catch (error) {
      console.error("Error in class assignment:", error);
      toast.error("Failed to assign classes");
    }
  };
  
  const toggleClassSelection = (classId: string) => {
    setSelectedClasses(prevSelected => 
      prevSelected.includes(classId)
        ? prevSelected.filter(id => id !== classId)
        : [...prevSelected, classId]
    );
  };

  const handleApproveVacation = async (id: string) => {
    try {
      const vacationToApprove = pendingVacations.find(v => v.id === id);
      if (!vacationToApprove) return;

      const { error } = await supabase
        .from('vacations')
        .update({ approved: true })
        .eq('id', id);
        
      if (error) {
        console.error("Error approving vacation:", error);
        toast.error("Failed to approve vacation");
        return;
      }

      await supabase
        .from('teacher_profiles')
        .update({ on_vacation: true })
        .eq('id', vacationToApprove.teacherId);

      setPendingVacations(pendingVacations.filter(v => v.id !== id));
      
      const formattedStartDate = vacationToApprove.startDate.toLocaleDateString();
      const formattedEndDate = vacationToApprove.endDate.toLocaleDateString();
      
      await createNotification({
        title: 'Vacation Approved',
        message: `Your vacation request from ${formattedStartDate} to ${formattedEndDate} has been approved.`,
        type: 'success',
        user_id: vacationToApprove.teacherId
      });
      
      toast.success("Vacation approved successfully");
      
      if (vacationToApprove.startDate && vacationToApprove.endDate) {
        const { data: affectedClasses } = await supabase
          .from('classes')
          .select('*')
          .eq('teacher_id', vacationToApprove.teacherId)
          .gte('date', vacationToApprove.startDate.toISOString())
          .lte('date', vacationToApprove.endDate.toISOString());
          
        if (affectedClasses && affectedClasses.length > 0) {
          toast.warning(`${affectedClasses.length} classes need to be reassigned during this vacation period.`);
          
          setAffectedClasses(affectedClasses);
          setShowAffectedClassesDialog(true);
        }
      }
    } catch (error) {
      console.error("Error in approve vacation flow:", error);
      toast.error("An error occurred while approving vacation");
    }
  };

  const handleRejectVacation = async (id: string) => {
    try {
      const vacationToReject = pendingVacations.find(v => v.id === id);
      if (!vacationToReject) return;

      const { error } = await supabase
        .from('vacations')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error rejecting vacation:", error);
        toast.error("Failed to reject vacation request");
        return;
      }

      setPendingVacations(pendingVacations.filter(v => v.id !== id));
      
      const formattedStartDate = vacationToReject.startDate.toLocaleDateString();
      const formattedEndDate = vacationToReject.endDate.toLocaleDateString();
      
      await createNotification({
        title: 'Vacation Request Rejected',
        message: `Your vacation request from ${formattedStartDate} to ${formattedEndDate} has been rejected.`,
        type: 'error',
        user_id: vacationToReject.teacherId
      });
      
      toast.success("Vacation request rejected");
    } catch (error) {
      console.error("Error in reject vacation flow:", error);
      toast.error("An error occurred while rejecting vacation");
    }
  };
  
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
            <p className="text-slate-600">Manage your teaching staff</p>
          </div>
          <Button 
            onClick={() => setIsAddTeacherOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Teacher
          </Button>
        </div>
        
        {pendingVacations.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-amber-800 flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Pending Vacation Requests ({pendingVacations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingVacations.map(vacation => (
                <VacationApprovalCard
                  key={vacation.id}
                  vacation={vacation}
                  onApprove={handleApproveVacation}
                  onReject={handleRejectVacation}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search teachers..."
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
          <div className="flex items-center gap-2">
            <Checkbox
              id="vacation-filter"
              checked={showVacationOnly}
              onCheckedChange={(checked) => setShowVacationOnly(checked as boolean)}
            />
            <label htmlFor="vacation-filter" className="text-sm text-slate-700 cursor-pointer">
              On vacation only
            </label>
          </div>
        </div>
        
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No teachers found</h3>
            <p className="mt-2 text-sm text-slate-600">
              {searchTerm || showVacationOnly
                ? "Try adjusting your search or filters"
                : "Get started by adding a new teacher"}
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsAddTeacherOpen(true)}>
                Add Teacher
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => (
              <UserCard
                key={teacher.id}
                user={teacher}
                onDelete={handleDeleteTeacher}
                onEdit={() => openAssignClasses(teacher)}
                editLabel="Assign Classes"
              />
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isAddTeacherOpen} onOpenChange={setIsAddTeacherOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Name*
              </label>
              <Input
                id="name"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email*
              </label>
              <div className="flex">
                <Input
                  id="email"
                  value={newTeacher.email}
                  onChange={handleEmailChange}
                  placeholder="john.doe"
                  className="rounded-r-none"
                  required
                />
                <div className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 text-slate-600 rounded-r-md flex items-center">
                  {newTeacher.emailDomain}
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Only enter the part before @fitnesshub.com
              </p>
            </div>
            
            <div>
              <label htmlFor="specialties" className="block text-sm font-medium text-slate-700 mb-1">
                Specialties
              </label>
              <Input
                id="specialties"
                value={newTeacher.specialties}
                onChange={(e) => setNewTeacher({...newTeacher, specialties: e.target.value})}
                placeholder="Yoga, Pilates, HIIT (comma separated)"
              />
              <p className="mt-1 text-xs text-slate-500">Separate multiple specialties with commas</p>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddTeacher}>Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAssignClassesOpen} onOpenChange={setIsAssignClassesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign Classes to {selectedTeacher?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
            {classes.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No classes available</p>
            ) : (
              classes.map((cls) => (
                <div key={cls.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-slate-50">
                  <Checkbox
                    id={`class-${cls.id}`}
                    checked={selectedClasses.includes(cls.id)}
                    onCheckedChange={() => toggleClassSelection(cls.id)}
                  />
                  <label 
                    htmlFor={`class-${cls.id}`} 
                    className="flex-1 cursor-pointer text-sm"
                  >
                    <span className="font-medium block">{cls.name}</span>
                    <span className="text-xs text-slate-500 block">
                      {cls.category} • {cls.date.toLocaleDateString()} • {cls.startTime}-{cls.endTime}
                    </span>
                  </label>
                </div>
              ))
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAssignClasses}>
              Save Assignments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAffectedClassesDialog} onOpenChange={setShowAffectedClassesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Affected Classes</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {affectedClasses.map(cls => (
              <div key={cls.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-slate-50">
                <span className="font-medium block">{cls.name}</span>
                <span className="text-xs text-slate-500 block">
                  {cls.category} • {cls.date.toLocaleDateString()} • {cls.startTime}-{cls.endTime}
                </span>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeachersPage;
