import React from "react";

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  mode?: "single" | "multiple";
  disabled?: (date: Date) => boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onSelect,
  mode,
  disabled,
}) => {
  // Implement your date picker logic here
  return (
    <div>
      {/* Your date picker UI */}
      <input type="date" onChange={(e) => onSelect(new Date(e.target.value))} />
    </div>
  );
};

export default DatePicker;
