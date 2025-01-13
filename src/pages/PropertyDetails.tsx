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
import { Separator } from "@/components/ui/separator";
import { Building2, Car, Info, Bed, Bath, Maximize } from "lucide-react";

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
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="px-4 py-1">
                <Building2 className="w-4 h-4 mr-2" />
                {property.propertyType}
              </Badge>
              <Badge variant="outline" className="px-4 py-1">
                <Car className="w-4 h-4 mr-2" />
                Parking Available
              </Badge>
              <Badge variant="outline" className="px-4 py-1">
                <Info className="w-4 h-4 mr-2" />
                {property.status}
              </Badge>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Property</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">{property.parkingSpaces}</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-semibold">{property.area}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 whitespace-pre-line mb-6">{property.description}</p>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Property Features</h3>
                  <ul className="space-y-2">
                    {property.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Property Details</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Listed: {new Date(property.dateListed).toLocaleDateString()}</p>
                    <p>Property Type: {property.propertyType}</p>
                    <p>Status: {property.status}</p>
                    <p>Interested Clients: {property.interestedClients}</p>
                  </div>
                </div>
              </div>
            </Card>

            <PropertyMap location={property.location} />
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Location Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Transportation</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Bus Station - 0.5 mi</li>
                    <li>Train Station - 1.2 mi</li>
                    <li>Airport - 8.5 mi</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Education</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Primary School - 0.3 mi</li>
                    <li>High School - 1.0 mi</li>
                    <li>University - 2.5 mi</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <ul className="space-y-1 text-gray-600">
                    <li>Shopping Mall - 0.8 mi</li>
                    <li>Supermarket - 0.4 mi</li>
                    <li>Hospital - 1.5 mi</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <PropertyInvestment propertyId={property.id} />
            <PropertySchedule />
          </div>
        </div>

        <div className="mt-12">
          <SimilarProperties currentPropertyId={property.id} />
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={selectedImage}
              alt="Property view"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
