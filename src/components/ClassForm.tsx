import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Teacher, Student } from '@/lib/types';
import { faker } from '@faker-js/faker';

interface ClassFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (classData: any) => void;
  classData?: any;
}

const ClassForm: React.FC<ClassFormProps> = ({ open, onClose, onSave, classData }) => {
  const [name, setName] = useState(classData?.name || '');
  const [description, setDescription] = useState(classData?.description || '');
  const [date, setDate] = useState(classData?.date || '');
  const [time, setTime] = useState(classData?.time || '');
  const [duration, setDuration] = useState(classData?.duration?.toString() || '60');
  const [capacity, setCapacity] = useState(classData?.capacity?.toString() || '20');
  const [teacherId, setTeacherId] = useState(classData?.teacherId || '');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    // Load teachers from localStorage
    const storedTeachers = localStorage.getItem('teachers');
    if (storedTeachers) {
      setTeachers(JSON.parse(storedTeachers));
    } else {
      // Create mock teachers if none exist
      const mockTeachers: Teacher[] = Array(3).fill(null).map((_, i) => ({
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'teacher',
        createdAt: new Date(),
        specialties: [faker.lorem.word(), faker.lorem.word()],
        onVacation: false,
        avatar: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`
      }));
      localStorage.setItem('teachers', JSON.stringify(mockTeachers));
      setTeachers(mockTeachers);
    }

    // Load students from localStorage
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  const handleSubmit = () => {
    const newClass = {
      id: classData?.id || faker.string.uuid(),
      name,
      description,
      date,
      time,
      duration: parseInt(duration),
      capacity: parseInt(capacity),
      teacherId,
      teacher: teachers.find(t => t.id === teacherId),
      enrolledStudents: classData?.enrolledStudents || [],
      createdAt: classData?.createdAt || new Date(),
    };
    onSave(newClass);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{classData ? 'Edit Class' : 'Create Class'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (min)
            </Label>
            <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">
              Capacity
            </Label>
            <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">
              Teacher
            </Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            {classData ? 'Update Class' : 'Create Class'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassForm;
