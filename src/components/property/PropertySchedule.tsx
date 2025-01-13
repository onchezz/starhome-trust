import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export const PropertySchedule = () => {
  const [date, setDate] = useState<Date>();

  const handleScheduleViewing = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      toast.success(`Viewing scheduled for ${selectedDate.toLocaleDateString()}`);
      setDate(selectedDate);
    }
  };

  const handleContactAgent = () => {
    toast.success("Connecting you with an agent...");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Schedule a Viewing</h2>
      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {date ? date.toLocaleDateString() : "Select Viewing Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(date) => handleScheduleViewing(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleContactAgent}
        >
          <Phone className="h-4 w-4" />
          Contact Agent
        </Button>
      </div>
    </Card>
  );
};