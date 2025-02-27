
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { FitnessClass } from "@/lib/types";
import { cn } from "@/lib/utils";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  addWeeks,
  subWeeks
} from "date-fns";

interface CalendarViewProps {
  classes: FitnessClass[];
  onSelectClass?: (fitnessClass: FitnessClass) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  classes,
  onSelectClass
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const todayClasses = selectedDate 
    ? classes.filter(c => isSameDay(new Date(c.date), selectedDate))
    : [];

  return (
    <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Weekly Schedule
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevWeek}
              className="p-1 rounded-md hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </span>
            <button
              onClick={nextWeek}
              className="p-1 rounded-md hover:bg-slate-100"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full grid grid-cols-7 border-b border-slate-100">
          {days.map((day, i) => {
            const dayClasses = classes.filter(c => isSameDay(new Date(c.date), day));
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={i}
                className={cn(
                  "p-3 text-center cursor-pointer transition-colors border-r border-slate-100 last:border-r-0",
                  isSelected 
                    ? "bg-primary/5 border-t-2 border-t-primary" 
                    : "hover:bg-slate-50",
                  isToday && !isSelected && "bg-slate-50"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <p className="text-xs font-medium text-slate-500 mb-1">
                  {format(day, "EEE")}
                </p>
                <p className={cn(
                  "text-sm font-medium",
                  isToday ? "text-primary" : "text-slate-700"
                )}>
                  {format(day, "d")}
                </p>
                {dayClasses.length > 0 && (
                  <div className="mt-1 flex justify-center">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                      {dayClasses.length}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="text-sm font-medium text-slate-700 mb-3">
          {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
        </h4>
        
        {todayClasses.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            No classes scheduled for this day
          </p>
        ) : (
          <div className="space-y-2">
            {todayClasses.map((fitnessClass) => (
              <motion.div
                key={fitnessClass.id}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer"
                onClick={() => onSelectClass && onSelectClass(fitnessClass)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-slate-900">{fitnessClass.name}</h5>
                    <p className="text-xs text-slate-500 mt-1">
                      {fitnessClass.startTime} - {fitnessClass.endTime} • {fitnessClass.teacherName}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-slate-700">
                      {fitnessClass.enrolledCount}/{fitnessClass.maxCapacity}
                    </span>
                    <div className={cn(
                      "ml-2 w-2 h-2 rounded-full",
                      fitnessClass.enrolledCount >= fitnessClass.maxCapacity
                        ? "bg-red-500"
                        : fitnessClass.enrolledCount >= fitnessClass.maxCapacity * 0.7
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    )} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
