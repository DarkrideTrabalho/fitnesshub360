
import React from "react";
import { format } from "date-fns";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { Vacation } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface VacationApprovalCardProps {
  vacation: Vacation;
  onApprove: (vacationId: string) => void;
  onReject: (vacationId: string) => void;
}

const VacationApprovalCard: React.FC<VacationApprovalCardProps> = ({
  vacation,
  onApprove,
  onReject
}) => {
  return (
    <Card className="overflow-hidden bg-white border border-slate-100 shadow-sm">
      <CardHeader className="bg-slate-50 p-4">
        <CardTitle className="text-base font-semibold flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-amber-500" />
          Vacation Request from {vacation.teacherName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center text-sm text-slate-600">
          <Clock className="h-4 w-4 mr-2 text-slate-400" />
          <span className="font-medium">Period:</span> 
          <span className="ml-2">
            {format(new Date(vacation.startDate), "MMM d, yyyy")} - {format(new Date(vacation.endDate), "MMM d, yyyy")}
          </span>
        </div>
        
        {vacation.reason && (
          <div className="text-sm text-slate-600">
            <span className="font-medium">Reason:</span> {vacation.reason}
          </div>
        )}
        
        <div className="text-xs text-slate-500">
          Request made on {format(new Date(vacation.createdAt), "MMM d, yyyy")}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-slate-50 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 text-red-600"
          onClick={() => onReject(vacation.id)}
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => onApprove(vacation.id)}
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VacationApprovalCard;
