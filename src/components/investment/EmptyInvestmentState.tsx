import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface EmptyInvestmentStateProps {
  error?: boolean;
}

export const EmptyInvestmentState = ({ error }: EmptyInvestmentStateProps) => (
  <Card className="p-6 text-center">
    <div className="flex flex-col items-center gap-4">
      <TrendingUp className="h-12 w-12 text-muted-foreground" />
      <div>
        <h3 className="text-lg font-semibold">No Investment Properties</h3>
        <p className="text-muted-foreground">
          {error 
            ? "Failed to load investment properties. Please try again later."
            : "There are currently no investment properties available."}
        </p>
      </div>
    </div>
  </Card>
);