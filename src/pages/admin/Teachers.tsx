
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, UserCheck, Calendar, Mail, User, Check, X } from 'lucide-react';
import { UserRole, Teacher, Vacation } from '@/lib/types';
import { faker } from '@faker-js/faker';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserCard from '@/components/UserCard';
import VacationApprovalCard from '@/components/VacationApprovalCard';

interface TeacherFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  teacher?: Teacher;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ open, onClose, onSave, teacher }) => {
  const [name, setName] = useState(teacher?.name || '');
  const [email, setEmail] = useState(teacher?.email || '');
  const [specialties, setSpecialties] = useState(teacher?.specialties?.join(', ') || '');
  const [avatarUrl, setAvatarUrl] = useState(teacher?.avatar || 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 100) + '.jpg');

  const handleSubmit = () => {
    const newTeacher: Teacher = {
      id: teacher?.id || faker.string.uuid(),
      userId: teacher?.userId || faker.string.uuid(),
      name,
      email,
      specialties: specialties.split(',').map(s => s.trim()),
      onVacation: teacher?.onVacation || false,
      avatar: avatarUrl,
      role: 'teacher',
      createdAt: teacher?.createdAt || new Date(),
    };
    onSave(newTeacher);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{teacher ? 'Edit Teacher' : 'Create Teacher'}</DialogTitle>
          <DialogDescription>
            {teacher ? 'Edit teacher details.' : 'Add a new teacher to the list.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar" className="text-right">
              Avatar URL
            </Label>
            <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="col-span-3" placeholder="https://example.com/avatar.jpg" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialties" className="text-right">
              Specialties
            </Label>
            <Input
              id="specialties"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Yoga, Pilates, Zumba"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            {teacher ? 'Update Teacher' : 'Create Teacher'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface VacationRequestFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (vacation: Vacation) => void;
  teacher: Teacher;
}

const VacationRequestForm: React.FC<VacationRequestFormProps> = ({ open, onClose, onSubmit, teacher }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    const vacation: Vacation = {
      id: faker.string.uuid(),
      teacherId: teacher.id,
      teacherName: teacher.name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      approved: false,
      createdAt: new Date(),
    };

    onSubmit(vacation);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Vacation</DialogTitle>
          <DialogDescription>
            Create a vacation request for {teacher.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input 
              id="startDate" 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input 
              id="endDate" 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3"
              placeholder="Reason for vacation request"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [vacationFormOpen, setVacationFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Get unique specialties from all teachers
  const allSpecialties = React.useMemo(() => {
    const specialties = new Set<string>();
    teachers.forEach(teacher => {
      teacher.specialties?.forEach(specialty => {
        specialties.add(specialty);
      });
    });
    return Array.from(specialties);
  }, [teachers]);

  useEffect(() => {
    // Load teachers from localStorage on component mount
    const storedTeachers = localStorage.getItem('teachers');
    if (storedTeachers) {
      setTeachers(JSON.parse(storedTeachers));
    } else {
      // If no teachers in localStorage, initialize with mock data
      const mockTeachers: Teacher[] = Array(8).fill(null).map((_, i) => ({
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        specialties: [faker.lorem.word(), faker.lorem.word()],
        onVacation: faker.datatype.boolean(),
        avatar: 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 100) + '.jpg',
        role: 'teacher',
        createdAt: faker.date.past(),
      }));
      localStorage.setItem('teachers', JSON.stringify(mockTeachers));
      setTeachers(mockTeachers);
    }

    // Load vacation requests
    const storedVacations = localStorage.getItem('vacations');
    if (storedVacations) {
      setVacations(JSON.parse(storedVacations));
    } else {
      // Create mock vacation data
      const mockVacations: Vacation[] = Array(3).fill(null).map((_, i) => ({
        id: faker.string.uuid(),
        teacherId: '',  // Will be assigned to random teachers below
        teacherName: '',
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        reason: faker.lorem.sentence(),
        approved: faker.datatype.boolean(),
        createdAt: faker.date.past(),
      }));
      
      setVacations(mockVacations);
    }
  }, []);

  // Assign teacher IDs to vacation requests and save to localStorage
  useEffect(() => {
    if (teachers.length > 0 && vacations.length > 0) {
      // Ensure each vacation has a valid teacherId and teacherName
      const updatedVacations = vacations.map(vacation => {
        if (!vacation.teacherId || !vacation.teacherName) {
          const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];
          return {
            ...vacation,
            teacherId: randomTeacher.id,
            teacherName: randomTeacher.name
          };
        }
        return vacation;
      });

      setVacations(updatedVacations);
      localStorage.setItem('vacations', JSON.stringify(updatedVacations));
    }
  }, [teachers, vacations]);

  // Filter teachers based on search query and specialty filter
  useEffect(() => {
    let filtered = teachers;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(teacher => 
        teacher.name.toLowerCase().includes(query) || 
        teacher.email.toLowerCase().includes(query)
      );
    }
    
    // Apply specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(teacher => 
        teacher.specialties?.some(s => s.toLowerCase() === specialtyFilter.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === "onVacation") {
      filtered = filtered.filter(teacher => teacher.onVacation);
    } else if (activeTab === "active") {
      filtered = filtered.filter(teacher => !teacher.onVacation);
    }
    
    setFilteredTeachers(filtered);
  }, [teachers, searchQuery, specialtyFilter, activeTab]);

  useEffect(() => {
    // Save teachers to localStorage whenever the state changes
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  const pendingVacationRequests = vacations.filter(v => !v.approved);

  const handleAddTeacher = () => {
    setOpen(true);
    setSelectedTeacher(null);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
    toast.success("Teacher deleted successfully");
  };

  const handleSaveTeacher = (teacher: Teacher) => {
    const updatedTeachers = teachers.map(t => t.id === teacher.id ? teacher : t);
    if (!teachers.find(t => t.id === teacher.id)) {
      setTeachers([...teachers, teacher]);
      toast.success(`Teacher ${teacher.name} created successfully`);
    } else {
      setTeachers(updatedTeachers);
      toast.success(`Teacher ${teacher.name} updated successfully`);
    }
  };

  const handleVacationRequest = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setVacationFormOpen(true);
  };

  const handleVacationSubmit = (vacation: Vacation) => {
    setVacations([...vacations, vacation]);
    toast.success(`Vacation request for ${vacation.teacherName} submitted successfully`);
  };

  const handleApproveVacation = (id: string) => {
    const updatedVacations = vacations.map(v => {
      if (v.id === id) {
        return { ...v, approved: true };
      }
      return v;
    });
    
    setVacations(updatedVacations);
    
    // Update teacher's vacation status
    const vacation = vacations.find(v => v.id === id);
    if (vacation) {
      const updatedTeachers = teachers.map(t => {
        if (t.id === vacation.teacherId) {
          return { 
            ...t, 
            onVacation: true,
            vacationDates: {
              start: vacation.startDate,
              end: vacation.endDate
            }
          };
        }
        return t;
      });
      
      setTeachers(updatedTeachers);
    }
    
    toast.success("Vacation request approved");
  };

  const handleRejectVacation = (id: string) => {
    setVacations(vacations.filter(v => v.id !== id));
    toast.success("Vacation request rejected");
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Teachers Management</h1>
            <p className="text-muted-foreground">
              Manage teacher profiles, specialties, and vacation requests.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleAddTeacher}>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Teachers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="onVacation">On Vacation</TabsTrigger>
              <TabsTrigger value="vacationRequests" className="relative">
                Vacation Requests
                {pendingVacationRequests.length > 0 && (
                  <Badge className="ml-2 bg-red-500">{pendingVacationRequests.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="w-[200px]">
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {allSpecialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map(teacher => (
                    <UserCard
                      key={teacher.id}
                      user={teacher}
                      onEdit={() => handleEditTeacher(teacher)}
                      onDelete={() => handleDeleteTeacher(teacher.id)}
                      buttons={[
                        {
                          icon: <Calendar className="h-4 w-4" />,
                          label: "Request Vacation",
                          onClick: () => handleVacationRequest(teacher)
                        }
                      ]}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map(teacher => (
                    <UserCard
                      key={teacher.id}
                      user={teacher}
                      onEdit={() => handleEditTeacher(teacher)}
                      onDelete={() => handleDeleteTeacher(teacher.id)}
                      buttons={[
                        {
                          icon: <Calendar className="h-4 w-4" />,
                          label: "Request Vacation",
                          onClick: () => handleVacationRequest(teacher)
                        }
                      ]}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onVacation" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeachers.map(teacher => (
                    <UserCard
                      key={teacher.id}
                      user={teacher}
                      onEdit={() => handleEditTeacher(teacher)}
                      onDelete={() => handleDeleteTeacher(teacher.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacationRequests" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {pendingVacationRequests.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No pending vacation requests
                    </div>
                  ) : (
                    pendingVacationRequests.map(vacation => (
                      <VacationApprovalCard
                        key={vacation.id}
                        vacation={vacation}
                        onApprove={handleApproveVacation}
                        onReject={handleRejectVacation}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TeacherForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher || undefined}
      />
      
      {selectedTeacher && (
        <VacationRequestForm
          open={vacationFormOpen}
          onClose={() => setVacationFormOpen(false)}
          onSubmit={handleVacationSubmit}
          teacher={selectedTeacher}
        />
      )}
    </DashboardLayout>
  );
};

export default TeachersPage;
