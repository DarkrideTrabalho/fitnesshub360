
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar } from 'lucide-react';

interface VacationApprovalCardProps {
  vacation: {
    id: string;
    teacherName?: string;
    startDate?: string;
    endDate?: string;
    reason?: string;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

// Alternative props structure for backward compatibility
interface LegacyVacationApprovalCardProps {
  teacherName: string;
  dateRange: string;
  reason: string;
  onApprove: () => void;
  onReject: () => void;
}

// Union type to accept both formats
type AcceptedProps = VacationApprovalCardProps | LegacyVacationApprovalCardProps;

const VacationApprovalCard = (props: AcceptedProps) => {
  // Check which prop format is being used
  const isLegacyProps = 'teacherName' in props && 'dateRange' in props;
  
  // For modern props (using vacation object)
  const vacation = isLegacyProps 
    ? null 
    : (props as VacationApprovalCardProps).vacation;
  
  // Format dates for display if using modern props
  const formattedStartDate = !isLegacyProps && vacation?.startDate 
    ? new Date(vacation.startDate).toLocaleDateString() 
    : '';
    
  const formattedEndDate = !isLegacyProps && vacation?.endDate 
    ? new Date(vacation.endDate).toLocaleDateString() 
    : '';
  
  // Handle different prop formats for display
  const displayTeacherName = isLegacyProps 
    ? (props as LegacyVacationApprovalCardProps).teacherName 
    : vacation?.teacherName || 'Unknown Teacher';
    
  const displayDateRange = isLegacyProps 
    ? (props as LegacyVacationApprovalCardProps).dateRange 
    : `${formattedStartDate} - ${formattedEndDate}`;
    
  const displayReason = isLegacyProps 
    ? (props as LegacyVacationApprovalCardProps).reason 
    : vacation?.reason || 'No reason provided';
  
  // Handle different prop formats for actions
  const handleApprove = () => {
    if (isLegacyProps) {
      (props as LegacyVacationApprovalCardProps).onApprove();
    } else {
      (props as VacationApprovalCardProps).onApprove(vacation!.id);
    }
  };
  
  const handleReject = () => {
    if (isLegacyProps) {
      (props as LegacyVacationApprovalCardProps).onReject();
    } else {
      (props as VacationApprovalCardProps).onReject(vacation!.id);
    }
  };
  
  return (
    <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-slate-900">{displayTeacherName}</h3>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <Calendar className="h-4 w-4 mr-1 text-amber-500" />
            <span>{displayDateRange}</span>
          </div>
          {displayReason && (
            <p className="mt-2 text-sm text-slate-600 bg-amber-50 p-2 rounded">
              {displayReason}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 hover:bg-red-50 text-red-600"
            onClick={handleReject}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-green-200 hover:bg-green-50 text-green-600"
            onClick={handleApprove}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VacationApprovalCard;
