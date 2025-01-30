import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface InvestmentHeaderProps {
  name: string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export const InvestmentHeader = ({
  name,
  isDrawerOpen,
  setIsDrawerOpen,
}: InvestmentHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">{name}</h1>
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu className="h-4 w-4 mr-2" />
            More Details
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  );
};