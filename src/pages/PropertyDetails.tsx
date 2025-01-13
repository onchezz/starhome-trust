import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import propertiesData from "@/data/properties.json";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyHighlights } from "@/components/property/PropertyHighlights";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInvestment } from "@/components/property/PropertyInvestment";
import { PropertySchedule } from "@/components/property/PropertySchedule";
import { SimilarProperties } from "@/components/property/SimilarProperties";

interface Property {
  id: number;
  title: string;
  location: string;
  totalInvestment: number;
  currentInvestment: number;
  investors: number;
  minInvestment: number;
  roi: string;
  type: string;
  images: string[];
  description: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const foundProperty = propertiesData.properties.find(
      (p) => p.id === Number(id)
    );
    if (foundProperty) {
      setProperty(foundProperty);
    }
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <PropertyHero 
        title={property.title}
        location={property.location}
        images={property.images}
        totalInvestment={property.totalInvestment}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyHighlights />

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Property</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </Card>

            <PropertyMap location={property.location} />
          </div>

          <div className="space-y-8">
            <PropertyInvestment
              minInvestment={property.minInvestment}
              investors={property.investors}
              roi={property.roi}
            />
            <PropertySchedule />
          </div>
        </div>

        <SimilarProperties currentPropertyId={property.id} />
      </div>
    </div>
  );
};

export default PropertyDetails;