
import React, { useState } from "react";
import { Plus, Users, Search, X } from "lucide-react";
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
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import UserCard from "@/components/UserCard";
import { Teacher, MOCK_TEACHERS } from "@/lib/types";

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVacationOnly, setShowVacationOnly] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    specialties: "",
  });
  
  const filteredTeachers = teachers.filter(teacher => {
    // Filter by search term
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by vacation status
    const matchesVacation = showVacationOnly ? teacher.onVacation : true;
    
    return matchesSearch && matchesVacation;
  });
  
  const handleAddTeacher = () => {
    // Simple validation
    if (!newTeacher.name || !newTeacher.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Create a new teacher object
    const teacher: Teacher = {
      id: `t${Date.now()}`,
      name: newTeacher.name,
      email: newTeacher.email,
      role: "teacher",
      createdAt: new Date(),
      specialties: newTeacher.specialties.split(",").map(s => s.trim()).filter(Boolean),
      onVacation: false,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTeacher.name}`,
    };
    
    // Add the new teacher to the list
    setTeachers([...teachers, teacher]);
    
    // Reset form and close dialog
    setNewTeacher({ name: "", email: "", specialties: "" });
    setIsAddTeacherOpen(false);
    
    toast.success("Teacher added successfully");
  };
  
  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    toast.success("Teacher deleted successfully");
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
              <Input
                id="email"
                type="email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                placeholder="john@example.com"
                required
              />
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
    </DashboardLayout>
  );
};

export default TeachersPage;
