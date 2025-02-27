
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-lg border border-slate-100 shadow-sm p-5",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-2xl font-semibold mt-1 text-slate-900">{value}</h4>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.positive 
                    ? "text-emerald-600" 
                    : "text-red-600"
                )}
              >
                {trend.positive ? "↑" : "↓"} {trend.value}%
              </span>
              <span className="text-xs text-slate-500 ml-1">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-primary/5 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
