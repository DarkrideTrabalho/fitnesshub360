
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Pencil, Trash2, Calendar, Mail, Phone, MapPin, FileText, Award, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import TeacherFormDialog, { TeacherFormData } from "@/components/TeacherFormDialog";
import { createTeacher, deleteTeacher, getAllTeachers, updateTeacher } from "@/services/teacherService";
import { getPendingVacations, updateVacationStatus } from "@/services/vacationService";
import VacationApprovalCard from "@/components/VacationApprovalCard";
import { Badge } from "@/components/ui/badge";
import { Vacation } from "@/lib/types";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  taxNumber: string;
  age: number;
  specialties: string;
  onVacation: boolean;
  avatarUrl?: string;
}

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pendingVacations, setPendingVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [vacationsLoading, setVacationsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activeTab, setActiveTab] = useState("teachers");
  const { user } = useAuth();

  const refetchTeachers = async () => {
    setLoading(true);
    try {
      const result = await getAllTeachers();
      if (result.success) {
        setTeachers(result.teachers);
      } else {
        console.error("Error fetching teachers:", result.error);
        toast.error("Failed to fetch teachers");
      }
    } catch (error) {
      console.error("Exception fetching teachers:", error);
      toast.error("An error occurred while fetching teachers");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingVacations = async () => {
    setVacationsLoading(true);
    try {
      const result = await getPendingVacations();
      if (result.success) {
        setPendingVacations(result.vacations);
      } else {
        console.error("Error fetching pending vacations:", result.error);
      }
    } catch (error) {
      console.error("Exception fetching pending vacations:", error);
    } finally {
      setVacationsLoading(false);
    }
  };

  useEffect(() => {
    refetchTeachers();
    fetchPendingVacations();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeacher = async (teacherData: TeacherFormData) => {
    try {
      const result = await createTeacher(teacherData);
      if (result.success) {
        await refetchTeachers();
      } else {
        toast.error("Failed to create teacher");
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error("An error occurred while creating teacher");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        const result = await deleteTeacher(teacherId);
        if (result.success) {
          await refetchTeachers();
          toast.success("Teacher deleted successfully");
        } else {
          toast.error("Failed to delete teacher");
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        toast.error("An error occurred while deleting teacher");
      }
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditOpen(true);
  };

  const handleUpdateTeacher = async (teacherData: TeacherFormData) => {
    if (!selectedTeacher) return;
    
    try {
      const result = await updateTeacher(selectedTeacher.id, teacherData);
      if (result.success) {
        await refetchTeachers();
      } else {
        toast.error("Failed to update teacher");
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("An error occurred while updating teacher");
    }
  };

  const handleApproveVacation = async (id: string) => {
    try {
      const result = await updateVacationStatus(id, 'approved');
      if (result.success) {
        toast.success("Vacation approved successfully");
        await fetchPendingVacations();
        await refetchTeachers(); // Refresh teachers to update vacation status
      }
    } catch (error) {
      console.error("Error approving vacation:", error);
      toast.error("Failed to approve vacation");
    }
  };

  const handleRejectVacation = async (id: string) => {
    try {
      const result = await updateVacationStatus(id, 'rejected');
      if (result.success) {
        toast.success("Vacation rejected successfully");
        await fetchPendingVacations();
      }
    } catch (error) {
      console.error("Error rejecting vacation:", error);
      toast.error("Failed to reject vacation");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardLayout title="Manage Teachers" role="admin">
      <div className="space-y-6">
        <Tabs 
          defaultValue="teachers" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="vacations">
                Vacation Requests
                {pendingVacations.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingVacations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "teachers" && (
              <Button 
                variant="default" 
                onClick={() => setOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Teacher
              </Button>
            )}
          </div>

          <TabsContent value="teachers" className="space-y-4">
            {activeTab === "teachers" && (
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
            )}

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No teachers found.</p>
                {searchTerm && (
                  <p className="mt-2 text-gray-400">
                    Try changing your search term or add a new teacher.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <Card
                    key={teacher.id}
                    className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${
                      teacher.onVacation ? 'border-amber-300' : ''
                    }`}
                  >
                    <div className={`p-5 ${teacher.onVacation ? 'bg-gradient-to-r from-amber-50 to-amber-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                      <div className="flex justify-between mb-4">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                          <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                          <AvatarFallback className="bg-primary/20 text-primary text-lg">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {teacher.onVacation && (
                          <div className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            On Vacation
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
                      
                      {teacher.specialties && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {teacher.specialties.split(',').map((specialty, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                              <Award className="w-3 h-3 mr-1" />
                              {specialty.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{teacher.phoneNumber}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{teacher.address}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Tax Number: {teacher.taxNumber}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Age: {teacher.age}</span>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTeacher(teacher)}
                          className="flex items-center gap-1"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="vacations">
            {vacationsLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : pendingVacations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">No pending vacation requests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingVacations.map((vacation) => (
                  <VacationApprovalCard
                    key={vacation.id}
                    vacation={vacation}
                    onApprove={handleApproveVacation}
                    onReject={handleRejectVacation}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Teacher Dialog */}
      <TeacherFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateTeacher}
      />

      {/* Edit Teacher Dialog */}
      {selectedTeacher && (
        <TeacherFormDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleUpdateTeacher}
          initialData={{
            name: selectedTeacher.name,
            email: selectedTeacher.email,
            phoneNumber: selectedTeacher.phoneNumber,
            address: selectedTeacher.address,
            taxNumber: selectedTeacher.taxNumber,
            age: selectedTeacher.age,
            specialties: selectedTeacher.specialties,
            avatarUrl: selectedTeacher.avatarUrl,
          }}
          isEditing
        />
      )}
    </DashboardLayout>
  );
};

export default TeachersPage;
