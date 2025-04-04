
import React from 'react';
import { FitnessClass, convertDbClassToFitnessClass } from '@/lib/types/classes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Map } from 'lucide-react';
import { format } from 'date-fns';

interface ClassOverviewCardProps {
  classItem: any;
}

// Extend FitnessClass to include location
interface ExtendedFitnessClass extends FitnessClass {
  location?: string;
}

const ClassOverviewCard: React.FC<ClassOverviewCardProps> = ({ classItem }) => {
  // Convert to FitnessClass format if needed
  const fitnessClass = 'date' in classItem && typeof classItem.date !== 'object' 
    ? convertDbClassToFitnessClass(classItem) 
    : classItem as ExtendedFitnessClass;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{fitnessClass.name}</CardTitle>
        <CardDescription>
          {fitnessClass.category && (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary mr-2">
              {fitnessClass.category}
            </span>
          )}
          With {fitnessClass.teacherName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-slate-500" />
            <span>{fitnessClass.startTime} - {fitnessClass.endTime}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-slate-500" />
            <span>{fitnessClass.enrolledCount} / {fitnessClass.maxCapacity} students</span>
          </div>
          {fitnessClass.location && (
            <div className="flex items-center">
              <Map className="h-4 w-4 mr-2 text-slate-500" />
              <span>{fitnessClass.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="text-xs text-slate-500">
          {format(fitnessClass.date, 'MMMM d, yyyy')}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClassOverviewCard;
