import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Pencil, Trash2, Calendar, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  createTeacherProfile,
  deleteTeacherProfile,
  fetchTeacherProfiles,
  updateTeacherProfile,
} from "@/services/userService";
import { format } from "date-fns";
import DatePicker from "@/components/ui/date-picker";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  requestVacation,
  getTeacherVacations,
  handleVacationRequest,
  Vacation,
} from "@/services/vacationService";
import { s } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";
import TeacherFormDialog from "@/components/TeacherFormDialog";

interface Teacher {
  id: string;
  name: string;
  email: string;
  role: "teacher";
  createdAt: Date;
  classes: string[];
  avatarUrl: string;
  taxNumber: string;
  phoneNumber: string;
  address: string;
  age: number;
  userId: string;
  onVacation: boolean;
  specialties: string;
}

const TeachersPage = () => {
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
      const fetchedTeachers = await fetchTeacherProfiles();
      setTeachers(fetchedTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to fetch teachers");
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

  const handleCreateTeacher = async (
    teacherData: Omit<
      Teacher,
      "id" | "createdAt" | "userId" | "onVacation" | "avatarUrl"
    >
  ) => {
    try {
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      await createTeacherProfile({ ...teacherData, userId: user.id });
      toast.success("Professor criado com sucesso");
      setOpen(false);
      await refetchTeachers();
    } catch (error) {
      console.error("Erro ao criar professor:", error);
      toast.error("Falha ao criar professor");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      await deleteTeacherProfile(teacherId);
      toast.success("Professor deletado com sucesso");
      await refetchTeachers();
    } catch (error) {
      console.error("Erro ao deletar professor:", error);
      toast.error("Falha ao deletar professor");
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditOpen(true);
  };

  return (
    <DashboardLayout title="Manage Teachers" role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teachers</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" onClick={() => setOpen(true)}>
                Add Teacher
              </Button>
            </DialogTrigger>
            <TeacherFormDialog
              open={open}
              onClose={() => setOpen(false)}
              onSubmit={handleCreateTeacher}
            />
          </Dialog>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading teachers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <h2 className="text-lg font-semibold">{teacher.name}</h2>
                <p>Email: {teacher.email}</p>
                <p>Phone: {teacher.phoneNumber}</p>
                <p>Address: {teacher.address}</p>
                <p>Tax Number: {teacher.taxNumber}</p>
                <p>Age: {teacher.age}</p>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeachersPage;
