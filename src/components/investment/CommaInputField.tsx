import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommaInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CommaInputField: React.FC<CommaInputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      const splitItems = value.split(",").map((item) => item.trim());
      setItems(splitItems);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
      />
      {items.length > 0 && (
        <ScrollArea className="h-32 rounded-md border p-2">
          <ul className="list-disc pl-4 space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
};

export default CommaInputField;
