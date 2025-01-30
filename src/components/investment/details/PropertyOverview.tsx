import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

interface PropertyOverviewProps {
  investmentType: string;
  size: number;
  constructionYear: number;
  constructionStatus: string;
}

export const PropertyOverview: React.FC<PropertyOverviewProps> = ({
  investmentType,
  size,
  constructionYear,
  constructionStatus,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          Property Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-semibold">{investmentType}</p>
          </div>
          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-semibold">{size} sq ft</p>
          </div>
          <div>
            <p className="text-gray-500">Construction Year</p>
            <p className="font-semibold">{constructionYear}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-semibold">{constructionStatus}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};