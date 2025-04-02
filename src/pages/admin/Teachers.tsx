import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { UserPlus, Pencil, Trash2, Calendar, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createTeacherProfile, deleteTeacherProfile, fetchTeacherProfiles, updateTeacherProfile } from '@/services/userService';
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { requestVacation, getTeacherVacations, handleVacationRequest, Vacation } from '@/services/vacationService';

interface Teacher {
  id: string;
  name: string;
  email: string;
  role: 'teacher';
  createdAt: Date;
  classes: string[];
  avatarUrl: string;
  taxNumber: string;
  phoneNumber: string;
  userId: string;
  onVacation: boolean;
}

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
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

  const handleCreateTeacher = async () => {
    if (!newTeacherName || !newTeacherEmail) {
      toast.error('Name and email are required');
      return;
    }

    try {
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      await createTeacherProfile(newTeacherName, newTeacherEmail, user.id);
      toast.success('Teacher created successfully');
      setOpen(false);
      setNewTeacherName('');
      setNewTeacherEmail('');
      await refetchTeachers();
    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error("Failed to create teacher");
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      await deleteTeacherProfile(teacherId);
      toast.success('Teacher deleted successfully');
      await refetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher");
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditOpen(true);
  };

  return (
    <DashboardLayout title="Teachers" role="admin">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Manage Teachers</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Teacher</DialogTitle>
                <DialogDescription>
                  Create a new teacher profile.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={newTeacherEmail} onChange={(e) => setNewTeacherEmail(e.target.value)} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleCreateTeacher}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {loading ? (
          <p>Loading teachers...</p>
        ) : (
          <Table>
            <TableCaption>A list of your teachers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">
                    <img src={teacher.avatarUrl} alt={teacher.name} className="w-8 h-8 rounded-full" />
                  </TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTeacher(teacher)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <TeacherProfile teacher={teacher} onClose={refetchTeachers} refetchTeachers={refetchTeachers} />
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTeacher(teacher.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {selectedTeacher && (
        <EditTeacherDialog
          open={editOpen}
          setOpen={setEditOpen}
          teacher={selectedTeacher}
          refetchTeachers={refetchTeachers}
        />
      )}
    </DashboardLayout>
  );
};

interface EditTeacherDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  teacher: Teacher;
  refetchTeachers: () => Promise<void>;
}

const EditTeacherDialog: React.FC<EditTeacherDialogProps> = ({ open, setOpen, teacher, refetchTeachers }) => {
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [taxNumber, setTaxNumber] = useState(teacher.taxNumber);
  const [phoneNumber, setPhoneNumber] = useState(teacher.phoneNumber);

  const handleUpdateTeacher = async () => {
    try {
      await updateTeacherProfile(teacher.id, {
        name,
        email,
        taxNumber,
        phoneNumber
      });
      toast.success('Teacher updated successfully');
      setOpen(false);
      await refetchTeachers();
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("Failed to update teacher");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>
            Make changes to the teacher profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taxNumber" className="text-right">Tax Number</Label>
            <Input id="taxNumber" value={taxNumber} onChange={(e) => setTaxNumber(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
            <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleUpdateTeacher}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface TeacherProfileProps {
  teacher: Teacher;
  onClose: () => void;
  refetchTeachers: () => Promise<void>;
}

const TeacherProfile = ({ teacher, onClose, refetchTeachers }: TeacherProfileProps) => {
  const [isVacationDialogOpen, setIsVacationDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const { user } = useAuth();
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loadingVacations, setLoadingVacations] = useState(true);

  useEffect(() => {
    const fetchVacationHistory = async () => {
      setLoadingVacations(true);
      try {
        const result = await getTeacherVacations(teacher.userId);
        if (result.success) {
          setVacations(result.vacations || []);
        } else {
          console.error('Failed to fetch vacation history');
          toast.error('Failed to load vacation history');
        }
      } catch (error) {
        console.error('Error fetching vacation history:', error);
        toast.error('Error loading vacation history');
      } finally {
        setLoadingVacations(false);
      }
    };

    fetchVacationHistory();
  }, [teacher.userId]);

  const handleVacationRequestSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      await requestVacation(teacher.userId, teacher.name, formattedStartDate, formattedEndDate, reason);
      toast.success('Vacation request submitted successfully');
      setIsVacationDialogOpen(false);
    } catch (error) {
      console.error('Error requesting vacation:', error);
      toast.error('Failed to request vacation');
    }
  };

  const renderVacations = () => {
    if (loadingVacations) return <p className="text-sm text-slate-500">Loading vacation history...</p>;
    
    if (!vacations.length) return <p className="text-sm text-slate-500">No vacation records found.</p>;
    
    return vacations.map(vacation => (
      <div key={vacation.id} className="p-3 border border-slate-200 rounded-md mb-2">
        <div className="flex justify-between">
          <span className="font-medium">{new Date(vacation.start_date).toLocaleDateString()} - {new Date(vacation.end_date).toLocaleDateString()}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            vacation.status === 'approved' ? 'bg-green-100 text-green-800' : 
            vacation.status === 'rejected' ? 'bg-red-100 text-red-800' : 
            'bg-amber-100 text-amber-800'
          }`}>
            {vacation.status === 'approved' ? 'Approved' : 
             vacation.status === 'rejected' ? 'Rejected' : 'Pending'}
          </span>
        </div>
        {vacation.reason && <p className="text-sm mt-1 text-slate-600">{vacation.reason}</p>}
      </div>
    ));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Teacher Profile</DialogTitle>
          <DialogDescription>
            View and manage teacher profile details and vacation requests.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="text-lg font-semibold mb-2">Teacher Information</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">Name</Label>
              <Input value={teacher.name} readOnly className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input value={teacher.email} readOnly className="col-span-2" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Vacation History</h3>
            {renderVacations()}
            <Button variant="default" onClick={() => setIsVacationDialogOpen(true)}>
              Request Vacation
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Vacation Request Dialog */}
      <Dialog open={isVacationDialogOpen} onOpenChange={setIsVacationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Vacation</DialogTitle>
            <DialogDescription>
              Fill out the details for your vacation request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={endDate ? (date) => date > endDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={startDate ? (date) => date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Reason</Label>
              <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsVacationDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleVacationRequestSubmit}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default TeachersPage;
