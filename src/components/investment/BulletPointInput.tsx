import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface BulletPointInputProps {
  label: string;
  points: string[];
  onChange: (points: string[]) => void;
}

const BulletPointInput: React.FC<BulletPointInputProps> = ({
  label,
  points,
  onChange,
}) => {
  const [newPoint, setNewPoint] = useState("");

  const handleAddPoint = () => {
    if (newPoint.trim()) {
      onChange([...points, newPoint.trim()]);
      setNewPoint("");
    }
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    onChange(newPoints);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPoint();
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={newPoint}
          onChange={(e) => setNewPoint(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Add new ${label.toLowerCase()}`}
          className="flex-1"
        />
        <Button type="button" onClick={handleAddPoint}>
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {points.map((point, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-50 p-2 rounded-md"
          >
            <span className="flex-1">• {point}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemovePoint(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulletPointInput;