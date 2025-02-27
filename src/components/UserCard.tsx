
import React from "react";
import { MoreHorizontal, Mail, Calendar } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Teacher } from "@/lib/types";
import { format } from "date-fns";

interface UserCardProps {
  user: User | Teacher;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  const isTeacher = user.role === 'teacher';
  const teacher = isTeacher ? user as Teacher : null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-slate-900">{user.name}</h3>
              <div className="flex items-center mt-1">
                <div className="text-xs text-slate-500 flex items-center">
                  <Mail className="mr-1 h-3 w-3" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="mt-3">
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
          
          {isTeacher && teacher?.specialties && (
            <div className="mt-2 flex flex-wrap gap-1">
              {teacher.specialties.map((specialty, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}
          
          {isTeacher && teacher?.onVacation && (
            <div className="mt-2 text-xs text-amber-600 flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              On vacation until {teacher.vacationDates ? format(teacher.vacationDates.end, 'MMM d, yyyy') : 'N/A'}
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-slate-500 flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          Joined {format(user.createdAt, 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
