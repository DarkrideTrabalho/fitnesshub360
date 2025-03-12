
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { FitnessClass, Teacher } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface ClassFormProps {
  initialData?: FitnessClass;
  onSubmit: (data: Partial<FitnessClass>) => void;
  onCancel: () => void;
}

// Sample class image options
const classImageOptions = [
  {
    url: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0",
    alt: "Yoga Class",
  },
  {
    url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb",
    alt: "HIIT Workout",
  },
  {
    url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2",
    alt: "Strength Training",
  },
  {
    url: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
    alt: "Pilates Class",
  },
  {
    url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5",
    alt: "CrossFit",
  },
];

const ClassForm: React.FC<ClassFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState<Partial<FitnessClass>>(
    initialData || {
      name: "",
      description: "",
      category: "",
      teacherId: "",
      teacherName: "",
      date: new Date(),
      startTime: "08:00",
      endTime: "09:00",
      maxCapacity: 15,
      enrolledCount: 0,
      imageUrl: "",
    }
  );
  const [date, setDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.date) : new Date()
  );
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from("teacher_profiles")
          .select("*")
          .eq("on_vacation", false); // Only active teachers

        if (error) {
          console.error("Error fetching teachers:", error);
          return;
        }

        if (data) {
          const transformedTeachers = data.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            email: teacher.email,
            role: "teacher" as const,
            createdAt: new Date(teacher.created_at),
            specialties: teacher.specialties || [],
            onVacation: false,
            avatarUrl: teacher.avatar_url,
          }));
          setTeachers(transformedTeachers);
        }
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  // Update formData when date changes
  useEffect(() => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  }, [date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleTeacherChange = (teacherId: string) => {
    const selectedTeacher = teachers.find((t) => t.id === teacherId);
    setFormData((prev) => ({
      ...prev,
      teacherId,
      teacherName: selectedTeacher ? selectedTeacher.name : "",
    }));
  };

  const handleTimeChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
    setIsImageDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.category ||
      !formData.teacherId ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Class Name*
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Morning Yoga"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A refreshing morning yoga session to start your day..."
              rows={4}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Category*
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Pilates">Pilates</SelectItem>
                <SelectItem value="HIIT">HIIT</SelectItem>
                <SelectItem value="Strength">Strength Training</SelectItem>
                <SelectItem value="CrossFit">CrossFit</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Dance">Dance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="teacher"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Teacher*
            </label>
            <Select
              value={formData.teacherId}
              onValueChange={handleTeacherChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.length === 0 ? (
                  <SelectItem value="no-teachers" disabled>
                    No teachers available
                  </SelectItem>
                ) : (
                  teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Date*
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Start Time*
              </label>
              <div className="flex">
                <Clock className="mr-2 h-4 w-4 text-slate-400 self-center" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleTimeChange("startTime", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                End Time*
              </label>
              <div className="flex">
                <Clock className="mr-2 h-4 w-4 text-slate-400 self-center" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleTimeChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="maxCapacity"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Max Capacity*
            </label>
            <Input
              id="maxCapacity"
              name="maxCapacity"
              type="number"
              min="1"
              value={formData.maxCapacity}
              onChange={handleNumberChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Class Image
            </label>
            <div className="flex gap-2">
              <div
                className="border border-slate-200 rounded-md w-16 h-16 flex items-center justify-center overflow-hidden"
                style={{ minWidth: "4rem" }}
              >
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Class"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsImageDialogOpen(true)}
                className="flex-1"
              >
                Select Image
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Update Class" : "Create Class"}
        </Button>
      </div>

      {/* Image Selection Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Class Image</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-4">
            {classImageOptions.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all",
                  formData.imageUrl === image.url && "ring-2 ring-primary"
                )}
                onClick={() => selectImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default ClassForm;
