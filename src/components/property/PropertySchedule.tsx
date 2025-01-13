import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";
import { toast } from "sonner";

export const PropertySchedule = () => {
  const handleScheduleViewing = () => {
    toast.success("Viewing request sent successfully!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Schedule a Viewing</h2>
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={handleScheduleViewing}
        >
          <Calendar className="h-4 w-4" />
          Schedule Tour
        </Button>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <Phone className="h-4 w-4" />
          Contact Agent
        </Button>
      </div>
    </Card>
  );
};