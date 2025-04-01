
import React, { useState, useEffect } from 'react';
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from 'lucide-react';
import { UserRole, Teacher } from '@/lib/types';
import { faker } from '@faker-js/faker';

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

  const handleSubmit = () => {
    const newTeacher: Teacher = {
      id: teacher?.id || faker.string.uuid(),
      userId: teacher?.userId || faker.string.uuid(),
      name,
      email,
      specialties: specialties.split(',').map(s => s.trim()),
      onVacation: teacher?.onVacation || false,
      avatar: teacher?.avatar || 'https://randomuser.me/api/portraits/men/' + Math.floor(Math.random() * 100) + '.jpg',
      role: 'teacher',
      createdAt: teacher?.createdAt || new Date(),
    };
    onSave(newTeacher);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{teacher ? 'Edit Teacher' : 'Create Teacher'}</DialogTitle>
          <DialogDescription>
            {teacher ? 'Edit teacher details.' : 'Add a new teacher to the list.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    // Load teachers from localStorage on component mount
    const storedTeachers = localStorage.getItem('teachers');
    if (storedTeachers) {
      setTeachers(JSON.parse(storedTeachers));
    } else {
      // If no teachers in localStorage, initialize with mock data
      const mockTeachers: Teacher[] = Array(5).fill(null).map((_, i) => ({
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
  }, []);

  useEffect(() => {
    // Save teachers to localStorage whenever the state changes
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  const handleAddTeacher = () => {
    setOpen(true);
    setSelectedTeacher(null);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
  };

  const handleDeleteTeacher = (id: string) => {
    const updatedTeachers = teachers.filter(teacher => teacher.id !== id);
    setTeachers(updatedTeachers);
  };

  const handleSaveTeacher = (teacher: Teacher) => {
    const updatedTeachers = teachers.map(t => t.id === teacher.id ? teacher : t);
    if (!teachers.find(t => t.id === teacher.id)) {
      setTeachers([...teachers, teacher]);
    } else {
      setTeachers(updatedTeachers);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teachers</CardTitle>
        <CardDescription>Manage teachers in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.specialties?.join(', ') || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditTeacher(teacher)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteTeacher(teacher.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <Button onClick={handleAddTeacher}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <TeacherForm
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSaveTeacher}
        teacher={selectedTeacher || undefined}
      />
    </Card>
  );
};

export default TeachersPage;
