
import React, { useState, useEffect } from "react";
import { Plus, Users, Search, X, Check } from "lucide-react";
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
import { Teacher, MOCK_TEACHERS, MOCK_CLASSES, FitnessClass } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [classes, setClasses] = useState<FitnessClass[]>(MOCK_CLASSES);
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
  
  // Load real data from Supabase if available
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
          // Transform to match the Teacher interface
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
          // Transform to match the FitnessClass interface
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

    fetchTeachers();
    fetchClasses();
  }, []);
  
  const filteredTeachers = teachers.filter(teacher => {
    // Filter by search term
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by vacation status
    const matchesVacation = showVacationOnly ? teacher.onVacation : true;
    
    return matchesSearch && matchesVacation;
  });
  
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s+/g, '').toLowerCase();
    setNewTeacher({...newTeacher, email: value});
  };
  
  const handleAddTeacher = async () => {
    // Simple validation
    if (!newTeacher.name || !newTeacher.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Create a new teacher object
    const fullEmail = newTeacher.email + newTeacher.emailDomain;
    const specialtiesArray = newTeacher.specialties
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
      
    try {
      // First try to create a user in Supabase auth
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: fullEmail,
        password: 'temporary123', // Temporary password that should be changed
        email_confirm: true
      });
      
      if (userError) {
        console.error("Error creating user:", userError);
        toast.error("Error creating user: " + userError.message);
        return;
      }
      
      // Then create the teacher profile
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
      
      // Add the new teacher to the local state
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
      
      // Reset form and close dialog
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
      // First find the teacher to get their user_id
      const teacher = teachers.find(t => t.id === teacherId);
      if (!teacher) return;
      
      // Delete from Supabase
      const { error } = await supabase
        .from('teacher_profiles')
        .delete()
        .eq('id', teacherId);
        
      if (error) {
        console.error("Error deleting teacher:", error);
        toast.error("Error deleting teacher: " + error.message);
        return;
      }
      
      // Update local state
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error("Error in teacher deletion:", error);
      toast.error("Failed to delete teacher");
    }
  };
  
  const openAssignClasses = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    
    // Get current assigned classes for this teacher
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
      // First, delete all existing assignments for this teacher
      const { error: deleteError } = await supabase
        .from('teacher_classes')
        .delete()
        .eq('teacher_id', selectedTeacher.id);
        
      if (deleteError) {
        console.error("Error deleting existing class assignments:", deleteError);
        toast.error("Error updating class assignments");
        return;
      }
      
      // Then, insert the new assignments
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
      
      {/* Add Teacher Dialog */}
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
      
      {/* Assign Classes Dialog */}
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
    </DashboardLayout>
  );
};

export default TeachersPage;
