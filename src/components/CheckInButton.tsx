
import React, { useState } from "react";
import { QrCode, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

interface CheckInButtonProps {
  onCheckIn: () => void;
  lastCheckIn?: Date;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({
  onCheckIn,
  lastCheckIn
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  
  const handleCheckIn = () => {
    setCheckedIn(true);
    onCheckIn();
    setTimeout(() => {
      setShowDialog(false);
      setTimeout(() => {
        setCheckedIn(false);
      }, 300);
    }, 1500);
  };
  
  const getLastCheckInText = () => {
    if (!lastCheckIn) return "You haven't checked in yet";
    
    const now = new Date();
    const checkInDate = new Date(lastCheckIn);
    const diffTime = Math.abs(now.getTime() - checkInDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = checkInDate.getHours().toString().padStart(2, '0');
      const minutes = checkInDate.getMinutes().toString().padStart(2, '0');
      return `Last check-in: Today at ${hours}:${minutes}`;
    } else if (diffDays === 1) {
      return "Last check-in: Yesterday";
    } else {
      return `Last check-in: ${diffDays} days ago`;
    }
  };

  return (
    <>
      <div className="text-center">
        <Button 
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 bg-primary px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          <QrCode className="h-5 w-5" />
          <span>Check In</span>
        </Button>
        <p className="text-xs text-slate-500 mt-2">{getLastCheckInText()}</p>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gym Check-In</DialogTitle>
            <DialogDescription>
              Scan this QR code at the entrance or press the button below to check in.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6">
            {checkedIn ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-fade-in">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Check-In Successful!</h3>
                <p className="text-sm text-slate-600 mt-2">Welcome to the gym</p>
              </div>
            ) : (
              <>
                <div className="bg-white p-3 border-2 border-slate-200 rounded-lg mb-4">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FitnessHub360CheckIn" 
                    alt="Check-in QR Code" 
                    width={150} 
                    height={150}
                    className="rounded"
                  />
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Show this QR code to the reception desk or use the button below for a manual check-in.
                </p>
              </>
            )}
          </div>
          
          <DialogFooter className="flex justify-center sm:justify-center">
            {!checkedIn && (
              <Button 
                onClick={handleCheckIn}
                className="w-full sm:w-auto"
              >
                Manual Check-In
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckInButton;
