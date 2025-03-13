
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Vacation {
  id: string;
  teacher_id: string | null;
  teacher_name: string | null;
  start_date: string;
  end_date: string;
  approved: boolean | null;
  reason: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface VacationApprovalCardProps {
  vacation: Vacation;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const VacationApprovalCard: React.FC<VacationApprovalCardProps> = ({
  vacation,
  onApprove,
  onReject
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PP');
  };

  const timeAgo = vacation.created_at 
    ? formatDistanceToNow(new Date(vacation.created_at), { addSuffix: true })
    : 'recently';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{vacation.teacher_name || 'Teacher'}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Requested {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Start Date:</span> {formatDate(vacation.start_date)}
          </div>
          <div>
            <span className="font-medium">End Date:</span> {formatDate(vacation.end_date)}
          </div>
          {vacation.reason && (
            <div>
              <span className="font-medium">Reason:</span> {vacation.reason}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={() => onReject(vacation.id)}
        >
          <X className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onApprove(vacation.id)}
        >
          <Check className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VacationApprovalCard;
