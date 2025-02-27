
import React from "react";
import { cn } from "@/lib/utils";

interface BadgeIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({
  icon,
  label,
  color = "bg-primary",
  onClick,
  className,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3 hover-scale cursor-pointer",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-white",
          color
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
};

export default BadgeIcon;
