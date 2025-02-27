
import React, { useState } from "react";
import { 
  Plus, 
  Calendar,
  Search, 
  ChevronLeft, 
  ChevronRight,
  X,
  CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
import ClassCard from "@/components/ClassCard";
import { FitnessClass, MOCK_CLASSES, MOCK_TEACHERS } from "@/lib/types";

const SchedulesPage = () => {
  const [classes, setClasses] = useState<FitnessClass[]>(MOCK_CLASSES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
    category: "",
    teacherId: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    maxCapacity: 10,
  });
  
  const uniqueCategories = Array.from(
    new Set(classes.map((cls) => cls.category))
  );
  
  const filteredClasses = classes.filter((cls) => {
    // Filter by search term
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "all" || cls.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddClass = () => {
    // Simple validation
    if (!newClass.name || !newClass.teacherId || !newClass.date || !newClass.startTime || !newClass.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Find teacher name
    const teacher = MOCK_TEACHERS.find(t => t.id === newClass.teacherId);
    if (!teacher) {
      toast.error("Selected teacher not found");
      return;
    }
    
    // Create a new class object
    const fitnessClass: FitnessClass = {
      id: `c${Date.now()}`,
      name: newClass.name,
      description: newClass.description,
      category: newClass.category,
      teacherId: newClass.teacherId,
      teacherName: teacher.name,
      date: newClass.date,
      startTime: newClass.startTime,
      endTime: newClass.endTime,
      maxCapacity: newClass.maxCapacity,
      enrolledCount: 0,
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    };
    
    // Add the new class to the list
    setClasses([...classes, fitnessClass]);
    
    // Reset form and close dialog
    setNewClass({
      name: "",
      description: "",
      category: "",
      teacherId: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      maxCapacity: 10,
    });
    setIsAddClassOpen(false);
    
    toast.success("Class added successfully");
  };
  
  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter(cls => cls.id !== classId));
    toast.success("Class deleted successfully");
  };
  
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Class Schedules</h1>
            <p className="text-slate-600">Manage your gym's class schedule</p>
          </div>
          <Button 
            onClick={() => setIsAddClassOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search classes..."
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
          
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Calendar className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-900">No classes found</h3>
            <p className="mt-2 text-sm text-slate-600">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filters" 
                : "Get started by adding a new class"}
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsAddClassOpen(true)}>
                Add Class
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                fitnessClass={cls}
                viewOnly={true}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Add Class Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Class Name*
              </label>
              <Input
                id="name"
                value={newClass.name}
                onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                placeholder="Morning Yoga"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <Input
                id="description"
                value={newClass.description}
                onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                placeholder="A refreshing morning yoga session"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                Category*
              </label>
              <Input
                id="category"
                value={newClass.category}
                onChange={(e) => setNewClass({...newClass, category: e.target.value})}
                placeholder="Yoga"
                required
              />
            </div>
            
            <div>
              <label htmlFor="teacher" className="block text-sm font-medium text-slate-700 mb-1">
                Teacher*
              </label>
              <Select 
                value={newClass.teacherId} 
                onValueChange={(value) => setNewClass({...newClass, teacherId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TEACHERS.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date*
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newClass.date ? format(newClass.date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={newClass.date}
                    onSelect={(date) => date && setNewClass({...newClass, date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 mb-1">
                  Start Time*
                </label>
                <Input
                  id="startTime"
                  type="time"
                  value={newClass.startTime}
                  onChange={(e) => setNewClass({...newClass, startTime: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 mb-1">
                  End Time*
                </label>
                <Input
                  id="endTime"
                  type="time"
                  value={newClass.endTime}
                  onChange={(e) => setNewClass({...newClass, endTime: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-slate-700 mb-1">
                Max Capacity*
              </label>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                value={newClass.maxCapacity}
                onChange={(e) => setNewClass({...newClass, maxCapacity: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddClass}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SchedulesPage;
