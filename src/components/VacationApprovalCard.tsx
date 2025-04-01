
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar } from 'lucide-react';
import { Vacation } from '@/lib/types';

interface VacationApprovalCardProps {
  vacation: Vacation;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const VacationApprovalCard = ({
  vacation,
  onApprove,
  onReject
}: VacationApprovalCardProps) => {
  // Format dates for display
  const formattedStartDate = vacation.startDate ? new Date(vacation.startDate).toLocaleDateString() : '';
  const formattedEndDate = vacation.endDate ? new Date(vacation.endDate).toLocaleDateString() : '';
  
  return (
    <div className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-slate-900">{vacation.teacherName}</h3>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <Calendar className="h-4 w-4 mr-1 text-amber-500" />
            <span>
              {formattedStartDate} - {formattedEndDate}
            </span>
          </div>
          {vacation.reason && (
            <p className="mt-2 text-sm text-slate-600 bg-amber-50 p-2 rounded">
              {vacation.reason}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 hover:bg-red-50 text-red-600"
            onClick={() => onReject(vacation.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-green-200 hover:bg-green-50 text-green-600"
            onClick={() => onApprove(vacation.id)}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VacationApprovalCard;
