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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar } from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  price: number;
  askingPrice: number;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    profileImage: string;
  };
  dateListed: string;
  propertyType: string;
  status: string;
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

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Property</h2>
              <p className="text-gray-600 whitespace-pre-line mb-6">{property.description}</p>
              
              <h3 className="font-semibold mb-3">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Agent Information</h2>
              <div className="flex items-start gap-4">
                <img 
                  src={property.agent.profileImage} 
                  alt={property.agent.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{property.agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{property.agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Listed on: {new Date(property.dateListed).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

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