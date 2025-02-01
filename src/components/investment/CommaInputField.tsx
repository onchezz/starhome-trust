import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommaInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CommaInputField: React.FC<CommaInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={disabled ? "bg-gray-50" : ""}
        disabled={disabled}
      />
    </div>
  );
};

export default CommaInputField;