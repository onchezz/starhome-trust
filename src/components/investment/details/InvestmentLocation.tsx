import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyMap } from "@/components/property/PropertyMap";

interface InvestmentLocationProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

export const InvestmentLocation = ({ location }: InvestmentLocationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>{location.address}</p>
            <p>
              {location.city}, {location.state}
            </p>
            <p>{location.country}</p>
          </div>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <PropertyMap location={location} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};