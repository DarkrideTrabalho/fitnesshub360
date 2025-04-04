
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import TeacherFormDialog, { TeacherFormData } from "@/components/TeacherFormDialog";
import { createTeacher, deleteTeacher, getAllTeachers } from "@/services/teacherService";

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
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

  useEffect(() => {
    refetchTeachers();
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

  return (
    <DashboardLayout title="Manage Teachers" role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teachers</h1>
          <Button 
            variant="default" 
            onClick={() => setOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Teacher
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{teacher.name}</h2>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                  {teacher.onVacation && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      On Vacation
                    </span>
                  )}
                </div>
                
                <div className="mt-4 space-y-1 text-sm">
                  <p><span className="font-medium">Phone:</span> {teacher.phoneNumber}</p>
                  <p><span className="font-medium">Address:</span> {teacher.address}</p>
                  <p><span className="font-medium">Tax Number:</span> {teacher.taxNumber}</p>
                  <p><span className="font-medium">Age:</span> {teacher.age}</p>
                  {teacher.specialties && (
                    <p>
                      <span className="font-medium">Specialties:</span>{" "}
                      {teacher.specialties}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
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
              </div>
            ))}
          </div>
        )}
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
          }}
          isEditing
        />
      )}
    </DashboardLayout>
  );
};

export default TeachersPage;
