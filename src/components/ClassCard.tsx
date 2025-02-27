
import React from "react";
import { motion } from "framer-motion";
import { FiUsers, FiClock } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FitnessClass } from "@/lib/types";
import { format } from "date-fns";

interface ClassCardProps {
  fitnessClass: FitnessClass;
  isEnrolled?: boolean;
  onEnroll?: (classId: string) => void;
  viewOnly?: boolean;
}

const ClassCard: React.FC<ClassCardProps> = ({
  fitnessClass,
  isEnrolled = false,
  onEnroll,
  viewOnly = false,
}) => {
  const {
    id,
    name,
    description,
    category,
    teacherName,
    date,
    startTime,
    endTime,
    maxCapacity,
    enrolledCount,
    imageUrl,
  } = fitnessClass;

  const availableSpots = maxCapacity - enrolledCount;
  const isFull = availableSpots <= 0;

  const formattedDate = format(date, "EEEE, MMM d");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col"
    >
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"})`,
        }}
      >
        <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent p-4 flex flex-col justify-end">
          <div className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-800 mb-2 self-start">
            {category}
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">{name}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <FiClock className="h-4 w-4 text-slate-400" />
              <span>
                {formattedDate}, {startTime} - {endTime}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <FiUsers className="h-4 w-4 text-slate-400" />
              <span>
                {enrolledCount}/{maxCapacity} enrolled
              </span>
            </div>
            <span className="text-sm font-medium text-slate-900">
              {teacherName}
            </span>
          </div>
        </div>

        {!viewOnly && (
          <div className="mt-auto">
            {isEnrolled ? (
              <Button
                variant="outline"
                className="w-full bg-slate-50 border-slate-200 text-slate-700"
                disabled
              >
                Enrolled
              </Button>
            ) : (
              <Button
                variant={isFull ? "outline" : "default"}
                className={`w-full ${
                  isFull
                    ? "bg-slate-50 text-slate-500 border-slate-200"
                    : "bg-primary text-white"
                }`}
                disabled={isFull}
                onClick={() => onEnroll && onEnroll(id)}
              >
                {isFull ? "Class Full" : `Enroll (${availableSpots} spots left)`}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClassCard;
