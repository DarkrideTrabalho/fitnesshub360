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

const TeacherFormDialog = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [age, setAge] = useState(0);
  const [specialties, setSpecialties] = useState("");

  const handleSubmit = () => {
    onSubmit({
      name,
      email,
      phoneNumber,
      address,
      taxNumber,
      age,
      specialties,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
              required
            />
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
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Teacher</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherFormDialog;
