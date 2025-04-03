
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { Vacation } from '@/lib/types/vacations';

interface VacationProps {
  id: string;
  teacherName: string;
  startDate: string | Date;
  endDate: string | Date;
  reason?: string;
  status?: string;
}

interface VacationApprovalCardProps {
  vacation: VacationProps;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const VacationApprovalCard: React.FC<VacationApprovalCardProps> = ({
  vacation,
  onApprove,
  onReject
}) => {
  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return format(new Date(date), 'dd MMM yyyy');
    }
    return format(date, 'dd MMM yyyy');
  };

  const startDate = formatDate(vacation.startDate);
  const endDate = formatDate(vacation.endDate);

  const getDateDifference = () => {
    const start = new Date(vacation.startDate);
    const end = new Date(vacation.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include the start and end days
  };

  // Don't show approve/reject buttons if the vacation is already approved or rejected
  const isPending = !vacation.status || vacation.status === 'pending';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Vacation Request</CardTitle>
        {vacation.status && vacation.status !== 'pending' && (
          <div className={`text-sm font-medium ${vacation.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
            Status: {vacation.status.charAt(0).toUpperCase() + vacation.status.slice(1)}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4 pb-0">
        <div className="flex items-center text-sm">
          <User className="w-4 h-4 mr-2 text-slate-500" />
          <span className="font-medium">{vacation.teacherName}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-slate-500" />
            <span>From: <span className="font-medium">{startDate}</span></span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-slate-500" />
            <span>To: <span className="font-medium">{endDate}</span></span>
          </div>
          <div className="text-sm text-slate-500 ml-6">
            ({getDateDifference()} days)
          </div>
        </div>
        
        {vacation.reason && (
          <div className="text-sm">
            <p className="font-medium mb-1">Reason:</p>
            <p className="text-slate-600">{vacation.reason}</p>
          </div>
        )}
      </CardContent>
      {isPending && (
        <CardFooter className="flex gap-2 pt-4">
          <Button 
            variant="default" 
            className="flex-1" 
            onClick={() => onApprove(vacation.id)}
          >
            Approve
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-red-600"
            onClick={() => onReject(vacation.id)}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VacationApprovalCard;
