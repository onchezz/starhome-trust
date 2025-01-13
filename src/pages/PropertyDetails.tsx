import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import propertiesData from "@/data/properties.json";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyHighlights } from "@/components/property/PropertyHighlights";
import { PropertyMap } from "@/components/property/PropertyMap";
import { PropertyInvestment } from "@/components/property/PropertyInvestment";
import { PropertySchedule } from "@/components/property/PropertySchedule";
import { SimilarProperties } from "@/components/property/SimilarProperties";

interface Property {
  id: string;
  title: string;
  location: {
    city: string;
    state: string;
    address: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  askingPrice: number;
  images: string[];
  description: string;
  interestedClients: number;
  annualGrowthRate: number;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const foundProperty = propertiesData.properties.find(
      (p) => p.id === id
    );
    if (foundProperty) {
      setProperty(foundProperty as Property);
    }
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
  }

  // Format the location as a string
  const formattedLocation = `${property.location.address}, ${property.location.city}, ${property.location.state}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <PropertyHero 
        title={property.title}
        location={formattedLocation}
        images={property.images}
        totalInvestment={property.price}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyHighlights />

            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">About This Property</h2>
              <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
            </div>

            <PropertyMap location={property.location} />
          </div>

          <div className="space-y-8">
            <PropertyInvestment
              minInvestment={property.price}
              investors={property.interestedClients}
              roi={`${property.annualGrowthRate}%`}
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