
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { toast } from "sonner";

interface TeacherFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (teacherData: TeacherFormData) => void;
  initialData?: TeacherFormData;
  isEditing?: boolean;
}

export interface TeacherFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  taxNumber: string;
  age: number;
  specialties: string;
  avatarUrl?: string;
}

const TeacherFormDialog: React.FC<TeacherFormDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [taxNumber, setTaxNumber] = useState(initialData?.taxNumber || "");
  const [age, setAge] = useState(initialData?.age || 0);
  const [specialties, setSpecialties] = useState(initialData?.specialties || "");
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!taxNumber.trim()) newErrors.taxNumber = "Tax number is required";
    if (!age || age <= 0) newErrors.age = "Valid age is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name,
        email,
        phoneNumber,
        address,
        taxNumber,
        age,
        specialties,
        avatarUrl,
      });
      
      toast.success(isEditing ? "Teacher updated successfully" : "Teacher added successfully");
      onClose();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // List of sample avatar URLs for quick selection
  const avatarOptions = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/3.jpg",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto py-4">
          {/* Avatar Selection */}
          <div className="flex flex-col items-center space-y-3 mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {name ? getInitials(name) : <User />}
              </AvatarFallback>
            </Avatar>
            
            <div className="w-full">
              <Label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700 mb-1">
                Avatar URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => setAvatarUrl("")}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter a URL for the teacher's avatar</p>
            </div>

            {/* Quick Avatar Selection */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {avatarOptions.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`rounded-full border-2 transition-all ${
                    avatarUrl === url ? 'border-primary scale-110' : 'border-transparent'
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={url} alt={`Avatar option ${index + 1}`} />
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Name*
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Phone Number*
            </Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+351 910000000"
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          <div>
            <Label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Address*
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <div>
            <Label
              htmlFor="taxNumber"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Tax Number*
            </Label>
            <Input
              id="taxNumber"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="123456789"
              className={errors.taxNumber ? "border-red-500" : ""}
            />
            {errors.taxNumber && <p className="text-red-500 text-xs mt-1">{errors.taxNumber}</p>}
          </div>
          <div>
            <Label
              htmlFor="age"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Age*
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className={errors.age ? "border-red-500" : ""}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>
          <div>
            <Label
              htmlFor="specialties"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Specialties
            </Label>
            <Input
              id="specialties"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="Yoga, Pilates"
            />
            <p className="text-xs text-gray-500 mt-1">Separate multiple specialties with commas</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEditing ? "Save Changes" : "Add Teacher"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherFormDialog;
