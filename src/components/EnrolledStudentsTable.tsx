
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, FileText, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  taxNumber?: string;
  avatarUrl?: string;
  enrolledClasses: {
    id: string;
    name: string;
    date: Date;
    startTime: string;
  }[];
}

interface EnrolledStudentsTableProps {
  students: EnrolledStudent[];
  loading: boolean;
  onViewDetails: (studentId: string) => void;
}

const EnrolledStudentsTable: React.FC<EnrolledStudentsTableProps> = ({
  students,
  loading,
  onViewDetails
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No enrolled students found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Classes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatarUrl} alt={student.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {student.taxNumber || 'No Tax Number'}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {student.email}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    {student.phoneNumber || 'No Phone Number'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {student.enrolledClasses.length > 0 ? (
                    student.enrolledClasses.map((classItem) => (
                      <div key={classItem.id} className="flex items-center text-xs border rounded-md px-2 py-1">
                        <CalendarCheck className="w-3 h-3 mr-1 text-primary" />
                        <span>
                          {classItem.name} - {format(classItem.date, 'MMM d')} at {classItem.startTime}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Not enrolled in any classes</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(student.id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EnrolledStudentsTable;
